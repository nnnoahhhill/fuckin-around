const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");
const {
    createMarketplace,
    renderPreviewSvg
} = require("./src/previewMarket");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const marketplace = createMarketplace();

const STATIC_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".txt": "text/plain; charset=utf-8"
};

function send(response, statusCode, body, headers = {}) {
    response.writeHead(statusCode, headers);
    response.end(body);
}

function sendJson(response, statusCode, body) {
    send(response, statusCode, JSON.stringify(body), {
        "Content-Type": "application/json; charset=utf-8"
    });
}

function sendError(response, statusCode, error) {
    sendJson(response, statusCode, { error: error.message || String(error) });
}

function requestIp(request, url) {
    return (
        url.searchParams.get("ip") ||
        request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        request.socket.remoteAddress ||
        "127.0.0.1"
    );
}

async function readJson(request) {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (!chunks.length) return {};
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function serveStatic(url, response) {
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.join(ROOT, pathname);

    if (!filePath.startsWith(ROOT)) {
        send(response, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
        return true;
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return false;
    }

    const extension = path.extname(filePath);
    const type = STATIC_TYPES[extension];
    if (!type) return false;

    send(response, 200, fs.readFileSync(filePath), {
        "Cache-Control": "no-store",
        "Content-Type": type
    });
    return true;
}

async function handleApi(request, response, url) {
    if (request.method === "GET" && url.pathname === "/api/marketplace") {
        sendJson(response, 200, marketplace.snapshot());
        return true;
    }

    if (request.method === "POST" && url.pathname === "/api/campaigns") {
        const payload = await readJson(request);
        sendJson(response, 201, marketplace.createCampaign(payload));
        return true;
    }

    const approvalMatch = url.pathname.match(/^\/api\/campaigns\/([^/]+)\/approve$/);
    if (request.method === "POST" && approvalMatch) {
        const payload = await readJson(request);
        sendJson(response, 200, marketplace.approveCampaign(approvalMatch[1], payload.party));
        return true;
    }

    const previewMatch = url.pathname.match(/^\/api\/previews\/([^/]+)\/([^/]+)\.svg$/);
    if (request.method === "GET" && previewMatch) {
        const [, listingId, linkId] = previewMatch;
        const selection = marketplace.selectPreview({
            campaignId: url.searchParams.get("campaignId") || undefined,
            ip: requestIp(request, url),
            linkId,
            listingId,
            segment: url.searchParams.get("segment") || undefined
        });
        const { seenCount } = marketplace.recordPreviewRequest({
            ip: requestIp(request, url),
            linkId,
            selection
        });
        const svg = renderPreviewSvg(selection, {
            color: url.searchParams.get("color") || undefined,
            style: url.searchParams.get("style") || "imessage"
        });

        send(response, 200, svg, {
            "Cache-Control": "private, max-age=300",
            "Content-Type": "image/svg+xml; charset=utf-8",
            "X-Preview-Marketimg-Creative": selection.kind === "ad" ? selection.campaign.id : "base",
            "X-Preview-Marketimg-Repeat-View": String(seenCount > 1),
            "X-Preview-Marketimg-Segment": selection.segment
        });
        return true;
    }

    return false;
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    try {
        if (await handleApi(request, response, url)) return;
        if (request.method === "GET" && serveStatic(url, response)) return;
        send(response, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    } catch (error) {
        sendError(response, 400, error);
    }
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Preview Marketimg listening on http://localhost:${PORT}`);
    });
}

module.exports = { marketplace, server };

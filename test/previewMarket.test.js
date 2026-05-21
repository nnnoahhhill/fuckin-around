const assert = require("node:assert/strict");
const test = require("node:test");
const {
    createMarketplace,
    createStore,
    dimensionsFor,
    renderPreviewSvg
} = require("../src/previewMarket");

test("selects an active approved campaign for a matching segment", () => {
    const marketplace = createMarketplace(createStore());
    const selection = marketplace.selectPreview({
        at: new Date("2026-05-21T00:00:00.000Z"),
        ip: "198.51.100.10",
        linkId: "sandwich-link",
        listingId: "bread-board",
        segment: "family-grocery"
    });

    assert.equal(selection.kind, "ad");
    assert.equal(selection.campaign.id, "seed-pbj");
    assert.match(selection.uniqueCode, /^PBJ-20-[A-Z0-9]{5}$/);
});

test("serves owner no-ad media when no approved campaign matches the target segment", () => {
    const marketplace = createMarketplace(createStore());
    const selection = marketplace.selectPreview({
        at: new Date("2026-05-21T00:00:00.000Z"),
        ip: "198.51.100.20",
        linkId: "sandwich-link",
        listingId: "bread-board",
        segment: "camping"
    });

    assert.equal(selection.kind, "base");
    assert.equal(selection.listing.id, "bread-board");
});

test("requires campaign CPM and budget to meet owner pricing", () => {
    const marketplace = createMarketplace(createStore());

    assert.throws(
        () => marketplace.createCampaign({
            budget: 100,
            buyer: "Cheap Jelly",
            code: "JAM",
            color: "#f43f5e",
            cpm: 1,
            endsAt: "2026-06-20",
            headline: "Low bid",
            listingId: "bread-board",
            product: "Jelly jar",
            slotId: "bottom-ribbon",
            startsAt: "2026-06-01",
            targetSegments: ["family-grocery"]
        }),
        /CPM must be at least 26/
    );
});

test("campaign becomes active after owner and buyer approvals", () => {
    const marketplace = createMarketplace(createStore());
    const campaign = marketplace.createCampaign({
        budget: 900,
        buyer: "Jam Works",
        code: "JAM-15",
        color: "#f43f5e",
        cpm: 28,
        endsAt: "2035-06-20",
        headline: "Jam belongs on sourdough.",
        listingId: "bread-board",
        product: "Strawberry jam",
        slotId: "bottom-ribbon",
        startsAt: "2020-06-01",
        targetSegments: ["family-grocery"]
    });

    assert.equal(campaign.lifecycle, "pending");
    marketplace.approveCampaign(campaign.id, "owner");
    const approved = marketplace.approveCampaign(campaign.id, "buyer");
    assert.equal(approved.lifecycle, "active");
});

test("records repeat views and A-B-A conversation signals", () => {
    const marketplace = createMarketplace(createStore());
    const baseRequest = {
        at: new Date("2026-05-21T00:00:00.000Z"),
        linkId: "recipe-thread",
        listingId: "bread-board",
        segment: "family-grocery"
    };

    const first = marketplace.selectPreview({ ...baseRequest, ip: "198.51.100.1" });
    marketplace.recordPreviewRequest({ ip: "198.51.100.1", linkId: baseRequest.linkId, selection: first });
    marketplace.recordPreviewRequest({ ip: "198.51.100.1", linkId: baseRequest.linkId, selection: first });

    const second = marketplace.selectPreview({ ...baseRequest, ip: "198.51.100.2" });
    marketplace.recordPreviewRequest({ ip: "198.51.100.2", linkId: baseRequest.linkId, selection: second });

    const third = marketplace.selectPreview({ ...baseRequest, ip: "198.51.100.1" });
    marketplace.recordPreviewRequest({ ip: "198.51.100.1", linkId: baseRequest.linkId, selection: third });

    assert.equal(marketplace.store.stats.repeatViews, 2);
    assert.equal(marketplace.store.stats.conversationSignals, 1);
});

test("renders SVG with requested format dimensions and banner copy", () => {
    const marketplace = createMarketplace(createStore());
    const selection = marketplace.selectPreview({
        at: new Date("2026-05-21T00:00:00.000Z"),
        ip: "198.51.100.10",
        linkId: "sandwich-link",
        listingId: "bread-board",
        segment: "family-grocery"
    });
    const svg = renderPreviewSvg(selection, { style: "wide" });
    const dimensions = dimensionsFor("wide");

    assert.match(svg, new RegExp(`width="${dimensions.width}" height="${dimensions.height}"`));
    assert.match(svg, /Bread deserves better peanut butter\./);
    assert.match(svg, /PBJ-20-[A-Z0-9]{5}/);
});

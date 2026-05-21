const SEGMENTS = [
    "family-grocery",
    "home-cooks",
    "lunch-packers",
    "camping",
    "dessert-makers",
    "gaming"
];

const STYLE_SIZES = {
    imessage: { width: 1200, height: 630 },
    square: { width: 1080, height: 1080 },
    wide: { width: 1600, height: 900 }
};

const SEED_LISTINGS = [
    {
        domain: "dailybread.example",
        estimatedMonthlyPreviews: 184000,
        headline: "Sourdough recipes, sandwich guides, school-lunch planners, and home baking.",
        id: "bread-board",
        installSnippet: '<meta property="og:image" content="https://preview.market/api/previews/bread-board/{slug}.svg">',
        marketSegments: ["family-grocery", "home-cooks", "lunch-packers"],
        media: {
            accent: "#f59e0b",
            background: "#78350f",
            subtitle: "Fresh recipes for people who already care about bread.",
            title: "Daily Bread"
        },
        owner: "Daily Bread Co-op",
        slots: [
            {
                floorSpend: 500,
                id: "top-ribbon",
                name: "Top ribbon",
                position: "top",
                recommendedCpm: 22
            },
            {
                floorSpend: 650,
                id: "bottom-ribbon",
                name: "Bottom coupon strip",
                position: "bottom",
                recommendedCpm: 26
            },
            {
                floorSpend: 900,
                id: "corner-badge",
                name: "Corner badge",
                position: "corner",
                recommendedCpm: 32
            }
        ]
    },
    {
        domain: "campfiremallows.example",
        estimatedMonthlyPreviews: 98000,
        headline: "Outdoor dessert culture, family trips, camping recipes, and cozy nights.",
        id: "mallow-board",
        installSnippet: '<meta property="og:image" content="https://preview.market/api/previews/mallow-board/{slug}.svg">',
        marketSegments: ["camping", "dessert-makers", "family-grocery"],
        media: {
            accent: "#f97316",
            background: "#431407",
            subtitle: "S'mores, fire pits, camp snacks, and sweet trip planning.",
            title: "Campfire Mallows"
        },
        owner: "Campfire Mallows",
        slots: [
            {
                floorSpend: 350,
                id: "top-ribbon",
                name: "Top ribbon",
                position: "top",
                recommendedCpm: 18
            },
            {
                floorSpend: 520,
                id: "bottom-ribbon",
                name: "Bottom deal strip",
                position: "bottom",
                recommendedCpm: 24
            }
        ]
    },
    {
        domain: "playpatch.gg",
        estimatedMonthlyPreviews: 312000,
        headline: "Patch notes and clips passed around gaming group chats and creator DMs.",
        id: "game-board",
        installSnippet: '<meta property="og:image" content="https://preview.market/api/previews/game-board/{slug}.svg">',
        marketSegments: ["gaming"],
        media: {
            accent: "#38bdf8",
            background: "#0f172a",
            subtitle: "New updates travel through squads before they hit the feed.",
            title: "PlayPatch"
        },
        owner: "PlayPatch.gg",
        slots: [
            {
                floorSpend: 1100,
                id: "top-ribbon",
                name: "Top sponsor ribbon",
                position: "top",
                recommendedCpm: 34
            },
            {
                floorSpend: 1700,
                id: "bottom-ribbon",
                name: "Launch code strip",
                position: "bottom",
                recommendedCpm: 42
            }
        ]
    }
];

const SEED_CAMPAIGNS = [
    {
        budget: 1800,
        buyer: "Peanut Butter Labs",
        code: "PBJ-20",
        color: "#f59e0b",
        cpm: 26,
        endsAt: "2035-01-01",
        headline: "Bread deserves better peanut butter.",
        id: "seed-pbj",
        listingId: "bread-board",
        ownerApproved: true,
        product: "Crunchy PB launch",
        slotId: "bottom-ribbon",
        startsAt: "2020-01-01",
        targetSegments: ["family-grocery", "lunch-packers"],
        weight: 2
    },
    {
        budget: 1300,
        buyer: "Golden Graham Co.",
        code: "SMORES",
        color: "#f97316",
        cpm: 24,
        endsAt: "2035-01-01",
        headline: "Add graham crunch to tonight's s'mores.",
        id: "seed-graham",
        listingId: "mallow-board",
        ownerApproved: true,
        product: "Honey graham squares",
        slotId: "bottom-ribbon",
        startsAt: "2020-01-01",
        targetSegments: ["camping", "dessert-makers"],
        weight: 1
    },
    {
        budget: 2800,
        buyer: "AimForge",
        code: "DROP-7",
        color: "#38bdf8",
        cpm: 42,
        endsAt: "2035-01-01",
        headline: "Squad drops get a launch-week skin.",
        id: "seed-game",
        listingId: "game-board",
        ownerApproved: true,
        product: "New tactical season",
        slotId: "top-ribbon",
        startsAt: "2020-01-01",
        targetSegments: ["gaming"],
        weight: 3
    }
].map((campaign) => ({ ...campaign, buyerApproved: true, createdAt: "2026-01-01T00:00:00.000Z" }));

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function hash(input) {
    let value = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
        value ^= input.charCodeAt(index);
        value = Math.imul(value, 16777619);
    }

    return value >>> 0;
}

function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function marketSegmentForIp(ip) {
    return SEGMENTS[hash(ip) % SEGMENTS.length];
}

function lifecycleFor(campaign, at = new Date()) {
    const now = at.getTime();
    const starts = new Date(`${campaign.startsAt}T00:00:00.000Z`).getTime();
    const ends = new Date(`${campaign.endsAt}T23:59:59.999Z`).getTime();

    if (!campaign.ownerApproved || !campaign.buyerApproved) return "pending";
    if (now < starts) return "scheduled";
    if (now > ends) return "ended";
    return "active";
}

function publicCampaign(campaign, at = new Date()) {
    return {
        ...campaign,
        lifecycle: lifecycleFor(campaign, at)
    };
}

function createStore() {
    return {
        campaigns: clone(SEED_CAMPAIGNS),
        linkTrails: new Map(),
        listings: clone(SEED_LISTINGS),
        seen: new Map(),
        stats: {
            adImpressions: 0,
            basePreviewViews: 0,
            conversationSignals: 0,
            previewRequests: 0,
            repeatViews: 0
        }
    };
}

function createMarketplace(seedStore = createStore()) {
    const store = seedStore;

    function getListing(listingId) {
        const listing = store.listings.find((item) => item.id === listingId);
        if (!listing) throw new Error(`Unknown listing: ${listingId}`);
        return listing;
    }

    function getSlot(listing, slotId) {
        const slot = listing.slots.find((item) => item.id === slotId);
        if (!slot) throw new Error(`Unknown slot for ${listing.id}: ${slotId}`);
        return slot;
    }

    function getCampaign(campaignId) {
        const campaign = store.campaigns.find((item) => item.id === campaignId);
        if (!campaign) throw new Error(`Unknown campaign: ${campaignId}`);
        return campaign;
    }

    function snapshot(at = new Date()) {
        return {
            campaigns: store.campaigns.map((campaign) => publicCampaign(campaign, at)),
            listings: clone(store.listings),
            stats: { ...store.stats }
        };
    }

    function createCampaign(input) {
        const listing = getListing(input.listingId);
        const slot = getSlot(listing, input.slotId);
        const cpm = Number(input.cpm);
        const budget = Number(input.budget);
        const targetSegments = Array.isArray(input.targetSegments) ? input.targetSegments : [];

        if (!input.buyer || !input.product || !input.headline || !input.code) {
            throw new Error("Buyer, product, headline, and code are required.");
        }
        if (!targetSegments.length || targetSegments.some((segment) => !listing.marketSegments.includes(segment))) {
            throw new Error("Campaign target segment must match the selected domain inventory.");
        }
        if (!Number.isFinite(cpm) || cpm < slot.recommendedCpm) {
            throw new Error(`CPM must be at least ${slot.recommendedCpm}.`);
        }
        if (!Number.isFinite(budget) || budget < slot.floorSpend) {
            throw new Error(`Budget must be at least ${slot.floorSpend}.`);
        }
        if (new Date(input.endsAt) < new Date(input.startsAt)) {
            throw new Error("Campaign end date must be after the start date.");
        }

        const id = `camp-${hash(`${input.listingId}:${input.buyer}:${input.product}:${Date.now()}`).toString(36)}`;
        const campaign = {
            budget,
            buyer: input.buyer,
            buyerApproved: false,
            code: input.code,
            color: input.color || slot.color || listing.media.accent,
            cpm,
            createdAt: new Date().toISOString(),
            endsAt: input.endsAt,
            headline: input.headline,
            id,
            listingId: listing.id,
            ownerApproved: false,
            product: input.product,
            slotId: slot.id,
            startsAt: input.startsAt,
            targetSegments,
            weight: Math.max(1, Math.round(cpm / slot.recommendedCpm))
        };

        store.campaigns.push(campaign);
        return publicCampaign(campaign);
    }

    function approveCampaign(campaignId, party) {
        const campaign = getCampaign(campaignId);
        if (party === "owner") campaign.ownerApproved = true;
        if (party === "buyer") campaign.buyerApproved = true;
        if (party !== "owner" && party !== "buyer") throw new Error("Approval party must be owner or buyer.");
        return publicCampaign(campaign);
    }

    function liveCampaignsFor({ at = new Date(), campaignId, listingId, segment }) {
        return store.campaigns.filter((campaign) => {
            if (campaign.listingId !== listingId) return false;
            if (campaignId && campaign.id !== campaignId) return false;
            if (lifecycleFor(campaign, at) !== "active") return false;
            return campaign.targetSegments.includes(segment);
        });
    }

    function selectPreview({ at = new Date(), campaignId, ip = "127.0.0.1", linkId, listingId, segment }) {
        const listing = getListing(listingId);
        const resolvedSegment = segment || marketSegmentForIp(ip);
        const liveCampaigns = liveCampaignsFor({ at, campaignId, listingId, segment: resolvedSegment });

        if (!liveCampaigns.length) {
            return { kind: "base", listing, segment: resolvedSegment };
        }

        const totalWeight = liveCampaigns.reduce((sum, campaign) => sum + campaign.weight, 0);
        const bucket = Math.floor(at.getTime() / 300000);
        let cursor = hash(`${listingId}:${linkId}:${ip}:${bucket}`) % totalWeight;
        const campaign = liveCampaigns.find((item) => {
            cursor -= item.weight;
            return cursor < 0;
        });

        return {
            campaign,
            kind: "ad",
            listing,
            segment: resolvedSegment,
            slot: getSlot(listing, campaign.slotId),
            uniqueCode: `${campaign.code}-${hash(`${campaign.id}:${linkId}:${ip}`).toString(36).slice(0, 5).toUpperCase()}`
        };
    }

    function recordPreviewRequest({ ip = "127.0.0.1", linkId, selection }) {
        store.stats.previewRequests += 1;
        const creativeId = selection.kind === "ad" ? selection.campaign.id : "base";
        const seenKey = `${selection.listing.id}:${linkId}:${ip}:${creativeId}`;
        const seenCount = (store.seen.get(seenKey) || 0) + 1;
        store.seen.set(seenKey, seenCount);

        if (seenCount > 1) store.stats.repeatViews += 1;
        if (selection.kind === "ad") store.stats.adImpressions += 1;
        if (selection.kind === "base") store.stats.basePreviewViews += 1;

        const trailKey = `${selection.listing.id}:${linkId}`;
        const trail = store.linkTrails.get(trailKey) || [];
        trail.push(ip);
        if (trail.length >= 3) {
            const recent = trail.slice(-3);
            if (recent[0] === recent[2] && recent[0] !== recent[1]) {
                store.stats.conversationSignals += 1;
            }
        }
        store.linkTrails.set(trailKey, trail.slice(-12));

        return { seenCount };
    }

    return {
        approveCampaign,
        createCampaign,
        getListing,
        recordPreviewRequest,
        selectPreview,
        snapshot,
        store
    };
}

function dimensionsFor(style) {
    const dimensions = STYLE_SIZES[style];
    if (!dimensions) throw new Error(`Unknown preview style: ${style}`);
    return dimensions;
}

function renderPreviewSvg(selection, options = {}) {
    const { width, height } = dimensionsFor(options.style || "imessage");
    const listing = selection.listing;
    const media = listing.media;
    const safeTitle = escapeXml(media.title);
    const safeSubtitle = escapeXml(media.subtitle);
    const segment = escapeXml(selection.segment);
    const padding = Math.round(width * 0.065);
    const titleSize = Math.round(width * 0.07);
    const subtitleSize = Math.round(width * 0.028);
    const background = options.background || media.background;

    let banner = "";
    if (selection.kind === "ad") {
        const campaign = selection.campaign;
        const color = options.color || campaign.color;
        const slot = selection.slot;
        const bannerHeight = Math.round(height * 0.18);
        const y = slot.position === "top" ? 0 : height - bannerHeight;
        const codeText = escapeXml(selection.uniqueCode);
        const headline = escapeXml(campaign.headline);
        const buyer = escapeXml(campaign.buyer);

        if (slot.position === "corner") {
            banner = `
                <g>
                    <rect x="${width - Math.round(width * 0.36)}" y="${Math.round(height * 0.06)}" width="${Math.round(width * 0.3)}" height="${Math.round(height * 0.2)}" rx="34" fill="${color}" />
                    <text x="${width - Math.round(width * 0.33)}" y="${Math.round(height * 0.15)}" font-size="${Math.round(width * 0.028)}" font-weight="900" fill="#020617">${buyer}</text>
                    <text x="${width - Math.round(width * 0.33)}" y="${Math.round(height * 0.205)}" font-size="${Math.round(width * 0.021)}" font-weight="800" fill="#020617">${codeText}</text>
                </g>`;
        } else {
            banner = `
                <g>
                    <rect x="0" y="${y}" width="${width}" height="${bannerHeight}" fill="${color}" />
                    <text x="${padding}" y="${y + Math.round(bannerHeight * 0.43)}" font-size="${Math.round(width * 0.026)}" font-weight="900" fill="#020617">${buyer}</text>
                    <text x="${padding}" y="${y + Math.round(bannerHeight * 0.74)}" font-size="${Math.round(width * 0.031)}" font-weight="900" fill="#020617">${headline}</text>
                    <rect x="${width - padding - Math.round(width * 0.2)}" y="${y + Math.round(bannerHeight * 0.27)}" width="${Math.round(width * 0.2)}" height="${Math.round(bannerHeight * 0.46)}" rx="22" fill="#020617" opacity="0.92" />
                    <text x="${width - padding - Math.round(width * 0.18)}" y="${y + Math.round(bannerHeight * 0.57)}" font-size="${Math.round(width * 0.026)}" font-weight="900" fill="#ffffff">${codeText}</text>
                </g>`;
        }
    }

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="${background}" />
                    <stop offset="62%" stop-color="#111827" />
                    <stop offset="100%" stop-color="#020617" />
                </linearGradient>
                <radialGradient id="halo" cx="28%" cy="18%" r="72%">
                    <stop offset="0%" stop-color="${media.accent}" stop-opacity="0.85" />
                    <stop offset="100%" stop-color="${media.accent}" stop-opacity="0" />
                </radialGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#bg)" />
            <rect width="${width}" height="${height}" fill="url(#halo)" />
            <circle cx="${width - padding}" cy="${padding}" r="${Math.round(width * 0.17)}" fill="${media.accent}" opacity="0.22" />
            <text x="${padding}" y="${Math.round(height * 0.38)}" font-family="Inter, Arial, sans-serif" font-size="${titleSize}" font-weight="950" letter-spacing="-3" fill="#ffffff">${safeTitle}</text>
            <text x="${padding}" y="${Math.round(height * 0.49)}" font-family="Inter, Arial, sans-serif" font-size="${subtitleSize}" font-weight="700" fill="#dbeafe">${safeSubtitle}</text>
            <text x="${padding}" y="${Math.round(height * 0.61)}" font-family="Inter, Arial, sans-serif" font-size="${Math.round(width * 0.024)}" font-weight="900" fill="${media.accent}">${segment.toUpperCase()} AUDIENCE</text>
            ${banner}
        </svg>`.trim();
}

module.exports = {
    SEGMENTS,
    createMarketplace,
    createStore,
    dimensionsFor,
    lifecycleFor,
    marketSegmentForIp,
    renderPreviewSvg
};

const state = {
    listings: [],
    campaigns: [],
    stats: {},
    selectedListingId: "",
    selectedSlotId: "",
    selectedColor: "#f59e0b",
    previewCampaignId: ""
};

const styles = [
    { id: "imessage", label: "iMessage / DM" },
    { id: "wide", label: "Twitter wide" },
    { id: "square", label: "Square crop" }
];

const money = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency"
});

const form = document.getElementById("campaign-form");
const listingGrid = document.getElementById("listing-grid");
const listingSelect = document.getElementById("listing-select");
const slotSelect = document.getElementById("slot-select");
const segmentSelect = form.elements.targetSegment;
const cpmInput = form.elements.cpm;
const budgetInput = form.elements.budget;
const renderGrid = document.getElementById("render-grid");
const metricsGrid = document.getElementById("metrics-grid");
const pricingGuidance = document.getElementById("pricing-guidance");
const previewTitle = document.getElementById("preview-title");
const previewSubmitButton = document.getElementById("preview-submit-button");
const approveButton = document.getElementById("approve-button");
const campaignStatus = document.getElementById("campaign-status");

function selectedListing() {
    return state.listings.find((listing) => listing.id === state.selectedListingId);
}

function selectedSlot() {
    const listing = selectedListing();
    return listing.slots.find((slot) => slot.id === state.selectedSlotId);
}

function today(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
}

async function api(path, options = {}) {
    const response = await fetch(path, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed: ${response.status}`);
    }

    return response.json();
}

async function loadMarketplace() {
    const data = await api("/api/marketplace");
    state.listings = data.listings;
    state.campaigns = data.campaigns;
    state.stats = data.stats;
    state.selectedListingId ||= data.listings[0].id;
    state.selectedSlotId ||= data.listings[0].slots[0].id;
    render();
}

function render() {
    renderListingGrid();
    renderSelectors();
    renderPreviews();
    renderPricingGuidance();
    renderMetrics();
}

function renderListingGrid() {
    listingGrid.innerHTML = state.listings.map((listing) => {
        const activeClass = listing.id === state.selectedListingId ? " active" : "";
        const lowCpm = Math.min(...listing.slots.map((slot) => slot.recommendedCpm));
        const tags = listing.marketSegments.map((segment) => `<span class="tag">${segment}</span>`).join("");

        return `
            <article class="listing-card${activeClass}">
                <div>
                    <p class="domain">${listing.domain}</p>
                    <h3>${listing.owner}</h3>
                    <p class="muted">${listing.headline}</p>
                </div>
                <div class="tag-row">${tags}</div>
                <code class="install-code">${listing.installSnippet}</code>
                <div class="price-line">
                    <strong>${money.format(lowCpm)}</strong>
                    <span class="muted">CPM floor</span>
                </div>
                <button class="button secondary" type="button" data-listing="${listing.id}">Use this inventory</button>
            </article>
        `;
    }).join("");

    listingGrid.querySelectorAll("[data-listing]").forEach((button) => {
        button.addEventListener("click", () => {
            const listing = state.listings.find((item) => item.id === button.dataset.listing);
            state.selectedListingId = listing.id;
            state.selectedSlotId = listing.slots[0].id;
            render();
            document.getElementById("composer").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function renderSelectors() {
    listingSelect.innerHTML = state.listings
        .map((listing) => `<option value="${listing.id}">${listing.domain} - ${listing.owner}</option>`)
        .join("");
    listingSelect.value = state.selectedListingId;

    const listing = selectedListing();
    slotSelect.innerHTML = listing.slots
        .map((slot) => `<option value="${slot.id}">${slot.name} - ${money.format(slot.recommendedCpm)} CPM</option>`)
        .join("");
    slotSelect.value = state.selectedSlotId;

    segmentSelect.innerHTML = listing.marketSegments
        .map((segment) => `<option value="${segment}">${segment.replaceAll("-", " ")}</option>`)
        .join("");

    const slot = selectedSlot();
    cpmInput.min = String(slot.recommendedCpm);
    cpmInput.value = String(Math.max(Number(cpmInput.value), slot.recommendedCpm));
    budgetInput.min = String(slot.floorSpend);
    budgetInput.value = String(Math.max(Number(budgetInput.value), slot.floorSpend));
}

function renderPreviews() {
    const seedCampaign = state.campaigns.find((campaign) => campaign.listingId === state.selectedListingId && campaign.lifecycle === "active");
    const campaignId = state.previewCampaignId || seedCampaign?.id || "";
    previewTitle.textContent = state.previewCampaignId ? "Campaign render set" : "Seeded live campaign";
    renderGrid.innerHTML = styles.map((style) => {
        const linkId = state.previewCampaignId ? "new-campaign" : "friend-chat";
        const url = `/api/previews/${state.selectedListingId}/${linkId}.svg?style=${style.id}&segment=family-grocery&campaignId=${campaignId}&color=${encodeURIComponent(state.selectedColor)}&t=${Date.now()}`;

        return `
            <div class="render-card">
                <span>${style.label}</span>
                <img class="preview-image" src="${url}" alt="${style.label} preview">
            </div>
        `;
    }).join("");
}

function renderPricingGuidance() {
    const slot = selectedSlot();
    const listing = selectedListing();
    const monthlyRequests = listing.estimatedMonthlyPreviews.toLocaleString();
    const suggestedSpend = Math.ceil((listing.estimatedMonthlyPreviews / 1000) * slot.recommendedCpm);

    pricingGuidance.innerHTML = `
        <strong>${slot.name}</strong> is priced at ${money.format(slot.recommendedCpm)} CPM.
        With ${monthlyRequests} estimated monthly preview requests, a full-slot month prices around
        ${money.format(suggestedSpend)}. Owner floor: ${money.format(slot.floorSpend)}.
    `;
}

function renderMetrics() {
    const stats = state.stats;
    const cards = [
        ["Preview requests", stats.previewRequests || 0],
        ["Served ads", stats.adImpressions || 0],
        ["No-ad media views", stats.basePreviewViews || 0],
        ["Repeat sticky views", stats.repeatViews || 0],
        ["A-B-A signals", stats.conversationSignals || 0],
        ["Active campaigns", state.campaigns.filter((campaign) => campaign.lifecycle === "active").length]
    ];

    metricsGrid.innerHTML = cards.map(([label, value]) => `
        <article class="metric-card">
            <strong>${value}</strong>
            <span class="muted">${label}</span>
        </article>
    `).join("");
}

function campaignPayload() {
    const data = new FormData(form);

    return {
        budget: Number(data.get("budget")),
        buyer: data.get("buyer").trim(),
        code: data.get("code").trim(),
        color: state.selectedColor,
        cpm: Number(data.get("cpm")),
        endsAt: data.get("endsAt"),
        headline: data.get("headline").trim(),
        listingId: data.get("listingId"),
        product: data.get("product").trim(),
        slotId: data.get("slotId"),
        startsAt: data.get("startsAt"),
        targetSegments: [data.get("targetSegment")]
    };
}

async function submitCampaign() {
    if (!form.reportValidity()) return;

    previewSubmitButton.disabled = true;
    campaignStatus.textContent = "Submitting campaign for owner and buyer approval...";

    try {
        const campaign = await api("/api/campaigns", {
            body: JSON.stringify(campaignPayload()),
            method: "POST"
        });

        state.previewCampaignId = campaign.id;
        approveButton.disabled = false;
        await loadMarketplace();
        state.previewCampaignId = campaign.id;
        approveButton.disabled = false;
        campaignStatus.textContent = `${campaign.buyer} campaign submitted. Preview renders are ready for approval.`;
        renderPreviews();
    } catch (error) {
        campaignStatus.textContent = error.message;
    } finally {
        previewSubmitButton.disabled = false;
    }
}

listingSelect.addEventListener("change", () => {
    const listing = state.listings.find((item) => item.id === listingSelect.value);
    state.selectedListingId = listing.id;
    state.selectedSlotId = listing.slots[0].id;
    render();
});

slotSelect.addEventListener("change", () => {
    state.selectedSlotId = slotSelect.value;
    render();
});

document.querySelectorAll(".swatch").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".swatch").forEach((swatch) => swatch.classList.remove("active"));
        button.classList.add("active");
        state.selectedColor = button.dataset.color;
        renderPreviews();
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitCampaign();
});

previewSubmitButton.addEventListener("click", submitCampaign);

approveButton.addEventListener("click", async () => {
    if (!state.previewCampaignId) return;

    approveButton.disabled = true;
    campaignStatus.textContent = "Approving campaign on behalf of owner and buyer...";
    await api(`/api/campaigns/${state.previewCampaignId}/approve`, {
        body: JSON.stringify({ party: "owner" }),
        method: "POST"
    });
    await api(`/api/campaigns/${state.previewCampaignId}/approve`, {
        body: JSON.stringify({ party: "buyer" }),
        method: "POST"
    });

    await loadMarketplace();
    approveButton.disabled = true;
    campaignStatus.textContent = "Campaign approved and live for matching preview requests.";
});

form.startsAt.value = today(0);
form.endsAt.value = today(30);
loadMarketplace().catch((error) => {
    document.body.innerHTML = `<main class="section"><h1>Backend is required.</h1><p class="lede">${error.message}</p><p class="muted">Run <code>npm start</code> so preview images and marketplace APIs are served request-time.</p></main>`;
});
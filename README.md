# Preview Marketimg

Link billboards.

Preview Marketimg is a marketplace for selling ad space inside the preview image that appears when a URL is shared in iMessage, Twitter/X, Instagram DMs, group chats, and other link unfurl surfaces.

## Product thesis

People usually send links to friends, group chats, customers, followers, or communities because the topic matters to them. That makes a shared preview image a high-trust market signal: a bread site is probably being shared around grocery, baking, family lunch, or sandwich interests; a marshmallow site can reasonably sell space to graham cracker, chocolate, camping, or fire pit brands.

Instead of letting every domain use the preview image only as a static logo card, domain owners can make that image a tiny digital billboard. The ad stays visual, does not block the destination site, does not interrupt the user, and is selected only when the preview image is requested.

## Marketplace model

- Domain owners list domains or subdomains, describe the audience, publish their normal no-ad preview media, set available banner slots, choose banner size and position, set CPM floors, define spend minimums, and install the Preview Marketimg `og:image` URL.
- Buyers browse inventory, pick a compatible domain, choose a banner placement, select a target segment, submit creative media/copy, preview multiple rendering styles, and wait for both parties to approve.
- Once approved, the backend serves the selected preview image dynamically when the messaging app, social app, crawler, or recipient device requests the image.
- Multiple campaigns can run on the same domain or link, rotating like TV commercials by link, IP, segment, campaign weight, and time bucket.
- Campaign creative can include discount codes, product names, launches, ongoing offers, or giveaway codes. The code can be unique per link/IP impression so a brand can run a "one shared link wins" campaign.
- Owners can use the product without selling ads by managing their own dynamic preview images and testing better preview creative.

## Targeting and measurement

- The request IP, domain, link ID, segment, campaign dates, and approval state decide which preview image is served.
- Repeat views are counted when the same IP sees the same link/creative again, which matters because chat previews are sticky and can be seen repeatedly as a thread is reopened.
- A-B-A request patterns are tracked: if IP A requests a preview, then IP B requests it, then IP A requests it again, that suggests people are discussing the link.
- Metrics stay simple: preview requests, served ads, no-ad media views, repeat sticky views, active campaigns, and conversation signals.

## Pricing guidance

Owners keep pricing freedom. The prototype gives slot-level guidance through CPM floors, estimated monthly preview requests, and spend minimums. A buyer can see the estimated full-slot monthly cost before submitting. Premium domains, niche intent, high repeat views, strong group-chat segments, exclusive slots, giveaways, and unique code campaigns should command higher prices.

## Identity and privacy

This is not limited to public creator identities or people showing their face. A domain owner, creator, or niche account can operate anonymously, hide their personal identity, and still sell preview inventory. The product direction includes anonymous accounts, masked owner profiles, voice-obscured approval calls or pitch videos, identity separation between payout/legal details and public marketplace pages, and review flows that let both sides approve creative without exposing unnecessary personal information.

## What this branch implements

- A celadon/white marketplace UI with domain inventory, campaign creation, creative previews, approval status, and metrics.
- A dependency-free Node server that serves the UI and API.
- Dynamic SVG preview images at `/api/previews/:listingId/:linkId.svg`.
- Campaign creation, buyer/owner approval, CPM and budget validation, segment checks, ad selection, unique codes, repeat-view metrics, and A-B-A conversation signals.
- Automated tests for targeting, no-ad media, pricing rules, approvals, SVG rendering, repeat views, and conversation signals.

## Run it

```bash
npm start
```

Open `http://localhost:4173`.

## Test it

```bash
npm test
```

## Dynamic preview endpoint

```text
/api/previews/:listingId/:linkId.svg?segment=family-grocery&style=imessage
```

Supported styles are `imessage`, `wide`, and `square`.

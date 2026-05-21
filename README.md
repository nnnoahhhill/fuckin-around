# Preview Marketimg

A full-stack prototype for selling and serving ad banners inside request-time social preview images.

## What it does

- Domain owners publish inventory with target markets, default no-ad media, banner slot positions, CPM guidance, spend floors, and the install snippet.
- Buyers create a campaign, choose a slot, target a market segment, submit creative copy, render preview sizes, and approve with the owner.
- The backend serves dynamic Open Graph SVG images at request time and rotates approved campaigns by link, IP, segment, and time bucket.
- Preview requests record impressions, repeat sticky views, and A-B-A request patterns that suggest two people are discussing the same link.

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

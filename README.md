# CreatiVault Free Tools Signal Desk

High-fidelity React + Vite prototype for the bilingual Free Tools hub and nine Signal pages

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4173/free-tools`

## Routes

- English hub: `/free-tools`
- Chinese hub: `/zh/free-tools`
- Tool route: `/free-tools/{slug}`
- Chinese tool route: `/zh/free-tools/{slug}`

## Prototype states

Add `?prototype=1` to a tool route to show the state controller

Example:

`/free-tools/competitor-ad-tracker?prototype=1`

Directly load a clean state with `?state=preview`, `?state=full`, or any of:

`idle`, `validating`, `running`, `preview`, `signup`, `full`, `paid`, `partial`, `noresult`, `ratelimit`, `error`

Related Signal navigation carries the current query object through the `q` parameter

## Design references

- `public/concepts/hub-concept.png`
- `public/concepts/tool-concept.png`

All product data is realistic mock data. No production API, authentication, credits, downloads, contact reveals, or payment is invoked

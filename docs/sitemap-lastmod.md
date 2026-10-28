# Sitemap lastmod

`public/sitemap.xml` lastmod values come from the checked-in map `lib/lastmod.json`.

## Why a checked-in map

Vercel production builds use a shallow git clone. Deriving lastmod from `git log` at build time would stamp nearly every URL with the deploy commit date. The build therefore **reads** `lib/lastmod.json` only (via `npm run lastmod` / `scripts/update-lastmod.mjs` without `--from-git`).

## Updating after a content change

1. Edit the page (and only its page-specific sources — see `lib/lastmod-sources.json`).
2. Locally with full history: `node scripts/update-lastmod.mjs --from-git /path`  
   or set the date in `lib/lastmod.json`, then `npm run lastmod`.
3. Commit `lib/lastmod.json`, `public/sitemap.xml`, and the `sitemap.xml` hash in `lib/preserved-site.json`.

## Source mapping rules

- Map **page-specific** files only (`app/.../page.tsx`, section components, page JSON-LD slot, page data).
- **Do not** list shared chrome: `app/layout.tsx`, `globals.css`, `SiteHeader`, `SiteFooter`, `lib/menu.ts`, or the whole `lib/preserved-site.json` (unrelated baseline edits would bump every URL).
- `/about/facts` tracks `public/facts.json` and the facts route. After changing `factsBodyHtml` in `preserved-site.json`, refresh facts.json or bump `/about/facts` in `lastmod.json` explicitly.

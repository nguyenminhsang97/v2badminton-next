# URL Rename Runbook

Use this runbook before changing any published URL. Published URLs can have
Google history, backlinks, paid ads, social posts, and internal links attached
to them, so every rename must leave a redirect trail.

## Path Rules

- Normalize every URL path to lowercase with one leading slash and one trailing
  slash, for example `/old-path/`.
- Keep destinations on the same canonical site unless a separate migration
  ticket says otherwise.
- Do not change money-page or legal-page URLs casually. Treat them as
  SEO-critical routes.
- Verify the redirect before deleting, moving, or republishing old content.

## Content-Platform URLs

These document types are routed through the CMS catch-all:

- `content_hub`
- `content_node`
- `content_article`
- `court`

Routine editors cannot rename `fullPath` after the document has been published.
If a rename is approved:

1. Record the current `fullPath` as the old URL.
2. Decide the new canonical `fullPath`.
3. Create and publish a `route_redirect` document:
   - `fromPath`: old URL
   - `toPath`: new URL
   - `permanent`: `true`
4. Rename the document only in the scoped ticket for that URL move. The redirect
   must exist first.
5. Verify:
   - Old URL redirects to the new URL.
   - New URL returns `200`.
   - Canonical points to the new URL.
   - Sitemap contains the new URL and not the retired URL.
   - Internal links no longer point at the old URL.

## File-Routed URLs

Some URLs are owned by files in `apps/web/src/app`, not by CMS content. CMS
`route_redirect` records do not apply to these paths because filesystem routes
match before the content catch-all.

For file-routed URL moves, add a redirect entry to
`apps/web/next.config.ts` in `FILE_ROUTE_REDIRECTS`:

```ts
{ source: "/old-page/", destination: "/new-page/", permanent: true }
```

Then verify:

- Old URL returns a permanent redirect.
- New URL returns `200`.
- Canonical metadata points to the new URL.
- `src/lib/routes.ts`, `src/app/sitemap.ts`, and internal navigation use the
  new URL.

## Reserved Prefixes

Do not create CMS pages or CMS redirects under code-owned prefixes:

- `/api/`
- `/blog/`
- `/dich-vu/`
- `/khuyen-mai/`
- `/san-pham/`
- `/studio/`

If one of these URLs must move, handle it in code through
`FILE_ROUTE_REDIRECTS` or the owning route implementation.

## Verification Commands

Run the normal gates before merging any URL move:

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

For production or preview smoke checks, prefer header checks first:

```powershell
curl.exe -I https://v2badminton.com/old-page/
curl.exe -I https://v2badminton.com/new-page/
```

The expected result is a permanent redirect from old to new, and a successful
response at the new canonical URL.

## Future Improvement

The ideal next layer is a Studio document action that creates subtree redirects
and performs the rename atomically. Until then, keep URL changes scoped to an
explicit rename ticket and make the redirect first.

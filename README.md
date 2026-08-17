# Next Sanity Boilerplate

A production ready starter for a bilingual (Hebrew and English) marketing site: a Next.js App Router
front end, a Sanity Studio with a page builder, RTL first styling, live preview, and CI that keeps
types, formatting and accessibility honest.

## Stack

| Layer      | Choice                                                            |
| ---------- | ----------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, Server Components)              |
| Styling    | Tailwind CSS v4 with semantic color tokens and logical properties |
| CMS        | Sanity v6 with Presentation live preview and document i18n        |
| Content    | Page builder blocks, Portable Text, structured SEO objects        |
| i18n       | next-intl, `he` (RTL, default) and `en` (LTR)                     |
| Types      | GROQ typegen into `web/sanity.types.ts`, committed to the repo    |
| Quality    | ESLint 10 flat config with local RTL, color and dash rules        |
| Tests      | Vitest for units, Playwright plus axe for e2e and accessibility   |
| Formatting | Prettier with the Tailwind class sorter, husky and lint-staged    |

The repo is an npm workspaces monorepo: `web/` is the site, `studio/` is the Sanity Studio, and
`eslint-local-rules/` is a small ESLint plugin shared by both.

## Quickstart

```bash
npm install
npm run init          # names the project, writes the env files, then removes itself
npx sanity login
npx sanity cors add http://localhost:3000 --credentials
npm run typegen       # extracts the schema and regenerates web/sanity.types.ts
npm run dev           # site on :3000, studio on :3333
```

`npm run init` is interactive. For scripted setup:

```bash
npm run init -- --yes --name acme-site --title "Acme" --project-id abc12345 \
  --dataset production --site-url https://acme.com
```

## Environment

The root `.env.example` documents every variable, but it is never loaded directly. Next.js loads
dotenv files from `web/` and the Sanity CLI loads them from `studio/`, so the values live in two
files. `npm run init` writes both of them for you.

| Variable                        | File             | Purpose                                              |
| ------------------------------- | ---------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `web/.env.local` | Sanity project id                                    |
| `NEXT_PUBLIC_SANITY_DATASET`    | `web/.env.local` | Dataset name, defaults to `production`               |
| `NEXT_PUBLIC_SITE_URL`          | `web/.env.local` | Absolute origin for canonicals, sitemap and OG       |
| `SANITY_API_READ_TOKEN`         | `web/.env.local` | Viewer token, server only, draft mode and auth reads |
| `SANITY_REVALIDATE_SECRET`      | `web/.env.local` | Shared secret the revalidate webhooks must send      |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `web/.env.local` | Optional, Google Analytics measurement id            |
| `NEXT_PUBLIC_POSTHOG_KEY`       | `web/.env.local` | Optional, PostHog project api key                    |
| `NEXT_PUBLIC_POSTHOG_HOST`      | `web/.env.local` | Optional, PostHog api host                           |
| `SANITY_STUDIO_PROJECT_ID`      | `studio/.env`    | Same project id, read by the studio workspace        |
| `SANITY_STUDIO_DATASET`         | `studio/.env`    | Same dataset, read by the studio workspace           |
| `SANITY_STUDIO_PREVIEW_ORIGIN`  | `studio/.env`    | Origin Presentation opens, `http://localhost:3000`   |

Both files are gitignored. In CI and on Vercel there are no dotenv files: set the same keys as
environment variables on the job or the project.

## Scripts

| Command                | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Site and studio together                                      |
| `npm run build`        | Typegen, then the Next build                                  |
| `npm run typecheck`    | `tsc --noEmit` in both workspaces                             |
| `npm run lint`         | ESLint over `web/`                                            |
| `npm run test`         | Vitest unit tests                                             |
| `npm run test:e2e`     | Playwright specs, skipped cleanly when no server is reachable |
| `npm run format:check` | Prettier check across the repo                                |
| `npm run audit:dashes` | Scans published Sanity content for em and en dashes           |

## Sanity webhooks

Create both under Sanity Manage, API, Webhooks. Trigger on create, update and delete, dataset
`production`, HTTP method POST, and set the secret to the same value as `SANITY_REVALIDATE_SECRET`.

**Path webhook** revalidates the exact page that changed.

- URL: `https://your-site.com/api/revalidate/path`
- Filter: `_type in ["page","post","legalDocument"]`
- Projection: `{"path": "/" + language + "/" + slug.current}`

**Tag webhook** revalidates every query that depends on a document type or a single document.

- URL: `https://your-site.com/api/revalidate/tag`
- Filter: leave empty so every document type is covered
- Projection: `{"tags": [_type, _type + ":" + slug.current]}`

## Deployment

**Site.** Deploy `web/` to Vercel. Set the root directory to `web`, add every `NEXT_PUBLIC_*`
variable plus `SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET`, and add the deployed origin
with `npx sanity cors add https://your-site.com --credentials`.

**Studio.** From `studio/`, run `npx sanity deploy` to publish it to
`https://your-project.sanity.studio`, then set `SANITY_STUDIO_PREVIEW_ORIGIN` to the production site
so Presentation previews the live deployment.

## Recipe: add a page builder block

1. Create the schema in `studio/src/schemaTypes/blocks/yourBlock.ts` with `defineType`.
2. Register it in `studio/src/schemaTypes/index.ts` and add it to the `of` array in
   `studio/src/schemaTypes/blocks/pageBuilder.ts`.
3. Add the block projection to `PAGE_BUILDER_FRAGMENT` in `web/src/sanity/fragments/index.ts`.
   Always select `_key` and `_type`.
4. Run `npm run typegen` so `web/sanity.types.ts` picks up the new shape, and commit the result.
5. Add the component in `web/src/components/blocks/YourBlock.tsx`, typed from the generated query
   result rather than a hand written interface.
6. Add the `case 'yourBlock'` branch to `web/src/components/blocks/PageBuilder.tsx`.

## Recipe: add a document type

1. Create `studio/src/schemaTypes/documents/yourDoc.ts`, including the shared `seo` object and, for
   translated content, the `language` field.
2. Register it in `studio/src/schemaTypes/index.ts`, and add it to `LOCALIZED_TYPES` if it is
   translated or `SINGLETON_TYPES` if there is only ever one.
3. Give it a place in `studio/src/structure/index.ts` so editors can find it.
4. Add a route in `ROUTES` (`web/src/config/urls.ts`) and, if it is linkable, a branch in
   `resolveInternalHref`.
5. Add a `defineQuery` in `web/src/sanity/queries/index.ts` with a globally unique name, then run
   `npm run typegen`.
6. Add the route under `web/src/app/[locale]/`, including `generateStaticParams` and
   `generateMetadata`, and include the type in the sitemap and in the path webhook filter.

# CLAUDE.md

## What this is

The Responsible IT (HvA lectoraat) website as a static site. All content is markdown + frontmatter in
`content/`; Eleventy turns it into HTML using the designer's templates (from `elizaWentz/RIT-website`,
whose `css/style.css` leads the look). Editors use the GitHub web UI, VS Code, or Sveltia CMS at
`/admin`, which writes the same files as pull requests. p5.js sketches are rendered to images at build
time with Playwright, so the site ships no p5 at runtime.

```
content/*.md ─┐                          ┌─ .cache/sketches/*.png (Playwright, cached by hash)
src/ (njk, css)├→ validate → eleventy ───┤
schema.yml ───┘                          └─ .cache/img (eleventy-img) → _site/ → nginx image → Coolify (RITA)
editors → Sveltia CMS (/admin) → PR on GitHub → Actions: validate, test, build, check → `deploy` branch → Coolify webhook
```

Not built on `_template/new-project.sh`: there is no backend; it is a static site generator.
Replaces the archived Payload attempt (`../archive/rit-cms`), whose project fields it reuses.

## Running

```bash
docker compose up -d dev                  # Eleventy dev server with live reload: http://localhost:$HOST_PORT
docker compose logs -f dev
docker compose run --rm cli npm run build # validate + render sketches + build into _site/
docker compose run --rm cli npm run check # every internal link/image in _site/ exists
docker compose --profile prod up -d --build site   # the production nginx image, from source,
                                          # served by Caddy on this host at https://$APP_DOMAIN
```

- The containers use the Playwright image (Chromium is needed to render sketches) and run as your UID.
  `node_modules/` lives in the project folder; the host Node is not used.
- Drafts (`draft: true`) show in the dev server only.
- `.env` only holds local settings: ports (`HOST_PORT`, `SITE_PORT`) and the Caddy route for the local
  prod image (`APP_DOMAIN=rit.paws.home`, `CADDY_NETWORK`). `site` has no host port by default.
  Production config lives in Coolify.

## Tests

```bash
docker compose run --rm cli npm test      # node:test — validator fixtures + src/lib/content.js
docker compose run --rm cli npm run validate
node scripts/screenshots.mjs http://127.0.0.1:8080 /tmp/shots   # desktop/tablet/phone screenshots,
                                          # reports console errors, broken images, horizontal overflow
```

- `tests/fixtures/valid` must pass; `tests/fixtures/broken` must produce exactly the listed errors.

## Architecture

```
content/                          ← editors' folder; nothing technical in here
  _data/site.yml                  menu, footer, default banner sketch (Sveltia: Instellingen)
  pages/<slug>.md                 home.md = "/", 404.md = /404.html, others /<slug>/; `sections:` list
  pages/images/                   media for pages
  projecten/<slug>/index.md       project + its photos + optional own sketch.js → /projecten/<slug>/
  nieuws/<slug>/index.md          → /nieuws/<slug>/
  agenda/<slug>/index.md          → /agenda/<slug>/
  mensen/<slug>/index.md          → /mensen/<slug>/
  partners/<slug>/index.md        no page; used by partner-logos and project partners
  sketches/<slug>/{index.md,sketch.js}   banner library (title, alt); no page, sketch.js is downloadable
src/
  admin/schema.yml                THE content schema = Sveltia config source (anchors allowed)
  admin/index.html                loads Sveltia CMS (pinned version) + preview styles
  lib/content.js                  folder → kind/slug/permalink, sketch resolution, schema loading
  _includes/dispatch.njk          global layout; picks layouts/<kind>.njk
  _includes/layouts/              base (header, a11y panel, footer), page, project, article, person, none
  _includes/sections/<type>.njk   one partial per section type in schema.yml
  _includes/components/           project-card, sketch-download, icons (macro)
  assets/css/style.css            designer's css/style.css, unchanged — leads
  assets/css/project-detail.css   designer's contentpagina.css (scoped; @font-face/reset dropped, h1 scoped)
  assets/css/site.css             additions: rendered sketches, filters, prose, news/agenda/people/partners
  assets/js/site.js               designer's script.js minus the p5 loader; accordion per block, filters
scripts/
  render-sketches.mjs             Playwright: sketch.js → PNG; also runs from eleventy.before
  validate-content.mjs            content/ vs schema.yml; GitHub annotations in Actions
  check-site.mjs                  broken internal links/images in _site/
  screenshots.mjs                 visual check helper
eleventy.config.js                collections, filters, sketchImage shortcode, image transform, admin config
Dockerfile                        from source (Playwright build stage → nginx)
Dockerfile.prebuilt               from an existing _site/ (what Coolify builds from the deploy branch; own .dockerignore)
nginx/default.conf                clean URLs, 301s for the old .html URLs, caching, 404
.github/workflows/site.yml        PR: validate, test, build, check; main: + force-push deploy branch, Coolify webhook
```

## Content model

- **schema.yml is the single source.** It drives the Sveltia forms (the build writes an expanded
  `_site/admin/config.yml`), the validator, and option labels on the site (`options`, `| label("field")`).
  Fields are required unless `required: false` (Decap/Sveltia convention). Unknown fields are errors.
- **Adding a field:** add it to `schema.yml`, render it in the template, add it to a fixture if it has rules.
- **Adding a section type:** add a type under `x-sections` in `schema.yml` and
  `src/_includes/sections/<name>.njk` (it receives `section`, `sectionIndex`, `page`, `collections`).
- **Adding a content kind:** `KINDS` in `src/lib/content.js`, a collection in `eleventy.config.js`, a
  Sveltia collection in `schema.yml`, and a layout mapping in `dispatch.njk`.
- Sketches: `sketch: <library-slug>` or `sketch_file: sketch.js` next to the entry (wins). Missing →
  `site.default_sketch`. Alt text: entry's `sketch_alt` → section `alt` → library `alt`.
- Media paths in frontmatter are relative to the entry; the `asset` filter makes them `/`-rooted so the
  image transform finds them from any page. Markdown images must have alt text (validator).
- Project cards on the homepage: `project-cards` section, `source: featured | latest | manual`.
- English later: add `content/en/…` with `lang: en` and extend `KINDS`/permalinks; nothing assumes NL-only
  except the template strings.

## Key constraints

- **Async shortcodes need `{% asyncEach %}`.** `sketchImage` is async; inside a plain `{% for %}` Nunjucks
  silently drops its output. Every loop that renders cards or sketches uses `asyncEach … endeach`.
- **Sketches must be static** (`noLoop()` + `randomSeed()`): the renderer captures the first completed
  `draw()`. A sketch that throws or takes >30 s fails the build with its path.
- Bump `RENDER_VERSION` in `render-sketches.mjs` to force re-rendering (e.g. renderer changes).
- Optimised images are generated into `.cache/img` and only the referenced ones are copied to `_site/img`
  (`copyReferencedImages`). CI caches `.cache/` between runs.
- Markdown is not run through Nunjucks (`markdownTemplateEngine: false`): editors can't break templates.
- `style.css` is the designer's file: change it only when the design changes; put additions in `site.css`.
- nginx uses `absolute_redirect off` (correct `Location` behind Coolify's TLS proxy).
- Sveltia: `publish_mode: editorial_workflow` (edits become PRs). Token sign-in needs a fine-grained
  token with Contents + Pull requests read/write; OAuth needs a `sveltia-cms-auth` helper (not deployed).
- Repo: `github.com/responsibleIT/rit-website-eleventy` (public). `main` is the source; `deploy` is
  generated by CI (built `_site/` + nginx config + `Dockerfile.prebuilt`, one force-pushed commit) — never
  edit it. Coolify app `rit-website-eleventy` (uuid `ecgkmnexhwg4c71cgvyzinpl`) clones `deploy` via
  Coolify's "Public GitHub" source (no credentials) and builds `Dockerfile.prebuilt`; serves
  preview.responsible-it.nl. Secrets: `COOLIFY_DEPLOY_URL`, `COOLIFY_TOKEN`. No ghcr image: the org
  doesn't allow making packages public.
- **Ask before** pushing, adding secrets, or touching Coolify on RITA.

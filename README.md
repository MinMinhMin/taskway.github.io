# Taskway SDK documentation.

This folder is a self-contained static documentation site for Taskway. It builds English and Vietnamese guides, and can be deployed to a GitHub Pages project site or a custom domain. The Vietnamese edition is written for Vietnamese readers and follows the same verified API contract as the English edition.

## Run locally

Requirements: Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

The development server prints the local address. To run all checks and build the static site:

```sh
npm test
npm run check
npm run build
npm run preview
```

The finished static site is in `dist/`. Search indexes are generated separately for English and Vietnamese. `npm run check` validates Astro components, article pairs, section IDs, source links, anchors, and shared examples before the build.

## Deployment settings

Copy `.env.example` to `.env` when building locally. For a project site such as `https://OWNER.github.io/REPOSITORY/`, set:

```sh
SITE_BASE_PATH=REPOSITORY
PUBLIC_SITE_URL=https://OWNER.github.io
PUBLIC_APP_URL=https://your-workspace.example
PUBLIC_DOCS_REPOSITORY=OWNER/REPOSITORY
```

`SITE_BASE_PATH` is the repository name for a project site. Leave it empty for a user/organization site or a custom domain served from `/`. `PUBLIC_SITE_URL` is the site origin without a trailing path. `PUBLIC_APP_URL` and `PUBLIC_DOCS_REPOSITORY` are optional. `PUBLIC_DOCS_PATH` defaults to `sdk_tutorial_github_pages`; set it to an empty value if the docs source is the repository root. Never put an API key in this site or in a public build variable.

## GitHub Pages

An example Actions workflow is in `internal/github-pages.yml`. Copy it to `.github/workflows/deploy-docs.yml` in the repository where you want Pages to publish. The example assumes this folder remains at `sdk_tutorial_github_pages/` in that repository and deploys a project site using the repository name as its base path. If you publish this folder as the root of a separate repository, remove the `sdk_tutorial_github_pages/` prefix from the workflow paths. For an `OWNER.github.io` repository or custom domain, remove the `SITE_BASE_PATH` workflow variable and set `PUBLIC_SITE_URL` to the served domain origin.

In the target repository, enable **Settings → Pages → Build and deployment → GitHub Actions**. The workflow publishes only `dist/`; it does not publish source files, examples, or internal contract notes.

## Update documentation

Each article lives under `src/content/docs/en/` and `src/content/docs/vi/`. Keep both files on the same `translationKey` slug and keep their section IDs aligned so the language switch can open the matching article and anchor. Links between articles should be relative to the current article folder (for example, `../compatibility/`) so they work under a GitHub Pages project path.

The frontmatter schema is in `src/content.config.mjs`; sidebar groups and labels are in `src/lib/navigation.js`. The UI strings for search, navigation, and controls are in `src/lib/i18n.js`. Build validation fails when a locale is missing, section IDs diverge, or a local article link points nowhere.

For runnable examples, edit files under `examples/` and embed them in Markdown with a fenced block such as:

````md
```python title="quickstart.py" snippet=python/quickstart.py
```
````

The build inserts the same source file into the article, and the content check verifies the reference. Keep all API behavior claims aligned with `internal/contract-matrix.md`; update that matrix when the service contract changes.

## Scope

The documentation describes the repository's current OpenAI-compatible `/v1` API contract. It does not guarantee that a particular deployed workspace has a provider, model, OCR feature, or quota enabled. Application and deployment configuration can be narrower than the defaults described here.

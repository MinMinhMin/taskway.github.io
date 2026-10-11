# Verification record

Results below are local source/build checks, not live service calls.

| Check | Result | Scope |
| --- | --- | --- |
| Node test suite | Passed (URL/base-path helpers, translation pairing, UI dictionary parity, content/site-check helpers) | Local unit tests; no backend calls |
| Content contract checks | Passed for 32 articles (16 locale pairs), section IDs, local article links, anchors, and shared snippets | Source files only |
| Astro check | Passed with zero errors/warnings/hints | Astro component and content diagnostics |
| Python/Node/cURL syntax checks | Passed for all shared examples | Parse/check only; no API key or live request used |
| Static build and Pagefind | Passed for both `/` and `/sample-repo/`; 36 HTML pages and separate 17-page English/Vietnamese indexes | Static output validation covered internal links, assets, anchors, and canonical URLs |
| Backend contract/fixture tests | Not run; `pytest` is unavailable in this environment | No database fixtures or live API requests were used |
| Browser interaction review | Not run; local HTTP server binding is blocked in this sandbox | Mobile, theme, keyboard, clipboard, and search UX need browser review |
| Live API behavior | Not run | No deployment, credentials, or billable request was used |

Pagefind reported that Vietnamese stemming is unavailable, so search matches indexed word forms without stemming. Search terms with accents and endpoint names are indexed normally; in-browser query behavior was not manually exercised.

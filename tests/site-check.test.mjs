import test from 'node:test';
import assert from 'node:assert/strict';
import { extractHtmlIds, extractHtmlTargets, mapLocalUrlToFile } from '../scripts/site-check-lib.mjs';

test('maps relative article routes and base-prefixed static assets to dist paths', () => {
  assert.equal(
    mapLocalUrlToFile('/tmp/site/dist', '/en/docs/overview/', '../quickstart/').filePath,
    '/tmp/site/dist/en/docs/quickstart/index.html',
  );
  assert.equal(
    mapLocalUrlToFile('/tmp/site/dist', '/repo/en/', '/repo/favicon.svg', '/repo/').filePath,
    '/tmp/site/dist/favicon.svg',
  );
});

test('flags root-relative links that bypass a GitHub Pages project prefix', () => {
  assert.throws(() => mapLocalUrlToFile('/tmp/site/dist', '/repo/en/', '/en/docs/quickstart/', '/repo/'), /does not include the configured base path/);
});

test('extracts local asset references and HTML ids', () => {
  assert.deepEqual(extractHtmlTargets('<a href="/repo/en/">Docs</a><script src="/repo/app.js"></script>'), ['/repo/en/', '/repo/app.js']);
  assert.deepEqual([...extractHtmlIds('<main id="main"><h2 id="start">Start</h2></main>')], ['main', 'start']);
});

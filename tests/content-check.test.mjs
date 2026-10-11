import test from 'node:test';
import assert from 'node:assert/strict';
import { checkArticlePairs, extractLocalLinks, checkSnippetReferences } from '../scripts/content-check-lib.mjs';

test('requires both locales and matching section anchors for each article', () => {
  const articles = [
    { locale: 'en', translationKey: 'intro', sections: ['start', 'next'] },
    { locale: 'vi', translationKey: 'intro', sections: ['start'] },
  ];
  const errors = checkArticlePairs(articles);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /section IDs differ/);
});

test('locale UI dictionaries expose the same non-empty controls', async () => {
  const { UI } = await import('../src/lib/i18n.js');
  assert.deepEqual(Object.keys(UI.en).sort(), Object.keys(UI.vi).sort());
  for (const locale of ['en', 'vi']) {
    for (const value of Object.values(UI[locale])) assert.ok(value.trim().length > 0);
  }
});

test('finds Markdown links that need static-path validation', () => {
  const links = extractLocalLinks('[sibling](./next/) [anchor](#part) [web](https://example.com)');
  assert.deepEqual(links, ['./next/', '#part']);
});

test('rejects absent or empty shared code samples', () => {
  assert.deepEqual(checkSnippetReferences('```py snippet=python/one.py\n```', new Map([['python/one.py', 'print(1)\n']])), []);
  assert.match(checkSnippetReferences('```py snippet=python/missing.py\n```', new Map())[0], /missing/);
  assert.match(checkSnippetReferences('```py snippet=python/empty.py\n```', new Map([['python/empty.py', '  \n']]))[0], /empty/);
});

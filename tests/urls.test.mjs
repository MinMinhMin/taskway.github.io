import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getLocaleFromPath,
  getLocalizedUrl,
  getOtherLocaleUrl,
  getCanonicalUrl,
  resolveStartupLocale,
} from '../src/lib/urls.js';
import { getArticleTarget, rewriteArticleLinks } from '../scripts/article-links.mjs';

test('localized URLs preserve a root or GitHub Pages project base', () => {
  assert.equal(getLocalizedUrl('/', 'en', '/docs/quickstart/'), '/en/docs/quickstart/');
  assert.equal(getLocalizedUrl('/sample-repo/', 'vi', '/docs/quickstart/'), '/sample-repo/vi/docs/quickstart/');
  assert.equal(getLocalizedUrl('/sample-repo', 'vi', '/'), '/sample-repo/vi/');
});

test('the locale in a deep route determines the visible language', () => {
  assert.equal(getLocaleFromPath('/sample-repo/vi/docs/quickstart/'), 'vi');
  assert.equal(getLocaleFromPath('/sample-repo/en/docs/quickstart/'), 'en');
  assert.equal(getLocaleFromPath('/sample-repo/docs/quickstart/'), null);
});

test('canonical URLs include the configured GitHub Pages base exactly once', () => {
  assert.equal(getCanonicalUrl('https://example.github.io', '/sample-repo/', '/en/docs/quickstart/'), 'https://example.github.io/sample-repo/en/docs/quickstart/');
  assert.equal(getCanonicalUrl('https://docs.example.com', '/', '/vi/'), 'https://docs.example.com/vi/');
  assert.equal(getCanonicalUrl('https://example.github.io', '/sample-repo/', '/sample-repo/en/'), 'https://example.github.io/sample-repo/en/');
  assert.equal(getCanonicalUrl('', '/', '/en/'), null);
});

test('article links resolve to sibling docs and include the Pages base path', () => {
  assert.equal(getArticleTarget('../compatibility/', { locale: 'en', slug: 'quickstart', basePath: 'sample-repo' }), '/sample-repo/en/docs/compatibility/');
  assert.equal(getArticleTarget('../quickstart/#first-request', { locale: 'vi', slug: 'chat-completions', basePath: '' }), '/vi/docs/quickstart/#first-request');
  const tree = { type: 'root', children: [{ type: 'link', url: '../files/', children: [] }] };
  rewriteArticleLinks(tree, { locale: 'vi', slug: 'compatibility', basePath: 'sample-repo' });
  assert.equal(tree.children[0].url, '/sample-repo/vi/docs/files/');
});

test('language switching preserves the document and section anchor', () => {
  assert.equal(
    getOtherLocaleUrl('/sample-repo/en/docs/quickstart/?tab=node#first-request', 'vi'),
    '/sample-repo/vi/docs/quickstart/?tab=node#first-request',
  );
});

test('the root locale preference beats browser language and defaults to English', () => {
  assert.equal(resolveStartupLocale('/', { savedLocale: 'vi', browserLanguages: ['en-US'] }), 'vi');
  assert.equal(resolveStartupLocale('/', { browserLanguages: ['vi-VN', 'en-US'] }), 'vi');
  assert.equal(resolveStartupLocale('/', { browserLanguages: ['en-US'] }), 'en');
});

 test('a locale-prefixed route beats a different saved preference', () => {
  assert.equal(resolveStartupLocale('/vi/docs/quickstart/', { savedLocale: 'en' }), 'vi');
});

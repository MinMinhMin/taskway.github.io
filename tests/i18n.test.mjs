import test from 'node:test';
import assert from 'node:assert/strict';

import { getMissingTranslations } from '../src/lib/i18n.js';

test('each localized page has exactly one counterpart', () => {
  assert.deepEqual(
    getMissingTranslations({ en: ['overview', 'quickstart'], vi: ['overview'] }),
    [{ locale: 'vi', slug: 'quickstart' }],
  );
});

test('matching translation sets produce no missing pages', () => {
  assert.deepEqual(getMissingTranslations({ en: ['overview'], vi: ['overview'] }), []);
});

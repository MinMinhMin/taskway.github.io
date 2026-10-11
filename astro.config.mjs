import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkBasePath from './scripts/remark-basepath.mjs';
import remarkSnippets from './scripts/remark-snippets.mjs';

const site = process.env.PUBLIC_SITE_URL?.trim() || undefined;
const base = `/${(process.env.SITE_BASE_PATH || '').replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '');

export default defineConfig({
  site,
  base: base || '/',
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: unified({ remarkPlugins: [remarkBasePath, remarkSnippets] }),
    shikiConfig: { theme: 'github-dark-default' },
  },
});

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rewriteArticleLinks, getBasePath } from './article-links.mjs';

const contentRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/docs');
const basePath = getBasePath(process.env.SITE_BASE_PATH);

export default function remarkBasePath() {
  return (tree, file) => {
    const frontmatter = file.data?.astro?.frontmatter || {};
    let locale = frontmatter.locale;
    let slug = frontmatter.translationKey;
    if (!locale || !slug) {
      const relative = path.relative(contentRoot, path.resolve(file.path || ''));
      const parts = relative.split(path.sep);
      locale = parts[0];
      slug = parts.slice(1).join('/').replace(/\.md$/, '');
    }
    if (!['en', 'vi'].includes(locale) || !slug || slug.startsWith('..')) return;
    rewriteArticleLinks(tree, { locale, slug, basePath });
  };
}

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkArticlePairs, extractLocalLinks, checkSnippetReferences } from './content-check-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(root, 'src/content/docs');
const exampleRoot = path.join(root, 'examples');

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : [file];
  }));
  return nested.flat();
}

function frontmatter(markdown, filename) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) throw new Error(`${filename}: missing YAML frontmatter`);
  const yaml = match[1];
  const scalar = (name) => yaml.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  const sections = [...yaml.matchAll(/^\s+- id:\s*([^\s]+)\s*$/gm)].map((item) => item[1]);
  return { locale: scalar('locale'), translationKey: scalar('translationKey'), sections };
}

function routeFromDoc(docRoot, filename) {
  const relative = path.relative(docRoot, filename).split(path.sep);
  const locale = relative[0];
  const slug = path.basename(relative.at(-1), '.md');
  return { locale, slug };
}

const errors = [];
const files = (await filesUnder(docsRoot)).filter((filename) => filename.endsWith('.md')).sort();
const articles = [];
const byRoute = new Map();
const snippets = new Map();
for (const filename of await filesUnder(exampleRoot)) {
  snippets.set(path.relative(exampleRoot, filename).split(path.sep).join('/'), await readFile(filename, 'utf8'));
}

for (const filename of files) {
  const markdown = await readFile(filename, 'utf8');
  let meta;
  try { meta = frontmatter(markdown, filename); }
  catch (error) { errors.push(error.message); continue; }
  const route = routeFromDoc(docsRoot, filename);
  if (!['en', 'vi'].includes(route.locale) || meta.locale !== route.locale) errors.push(`${filename}: locale must match its content directory`);
  if (meta.translationKey !== route.slug) errors.push(`${filename}: translationKey must match the document slug`);
  if (!meta.sections.length) errors.push(`${filename}: declare at least one section ID`);
  articles.push({ ...meta, file: filename, ...route });
  byRoute.set(`${route.locale}/${route.slug}`, { filename, markdown });
  errors.push(...checkSnippetReferences(markdown, snippets).map((message) => `${filename}: ${message}`));

  const headingIds = new Set([...markdown.matchAll(/\bid="([^"]+)"/g)].map((item) => item[1]));
  for (const sectionId of meta.sections) {
    if (!headingIds.has(sectionId)) errors.push(`${filename}: section ID has no matching heading: ${sectionId}`);
  }
  for (const href of extractLocalLinks(markdown)) {
    if (href.startsWith('#')) {
      if (!headingIds.has(decodeURIComponent(href.slice(1)))) errors.push(`${filename}: anchor target not found: ${href}`);
      continue;
    }
    if (/^\/(en|vi)\//.test(href)) {
      errors.push(`${filename}: locale-root link bypasses GitHub Pages base path: ${href}`);
      continue;
    }
    const routePath = path.posix.normalize(path.posix.join(route.slug, href));
    const targetSlug = routePath.replace(/^\.\//, '').replace(/\/$/, '');
    const target = path.join(docsRoot, route.locale, `${targetSlug}.md`);
    try {
      if (!(await stat(target)).isFile()) errors.push(`${filename}: local document link is not a file: ${href}`);
    } catch {
      errors.push(`${filename}: local document link is not a file: ${href}`);
    }
  }
}

errors.push(...checkArticlePairs(articles));
if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} articles: translations, section IDs, local links, anchors, and shared snippets are valid.`);
}

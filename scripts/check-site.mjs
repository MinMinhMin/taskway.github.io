import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHtmlIds, extractHtmlTargets, mapLocalUrlToFile } from './site-check-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const base = process.env.SITE_BASE_PATH || '/';

async function listHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtml(filename) : entry.name.endsWith('.html') ? [filename] : [];
  }))).flat();
}

const errors = [];
const htmlFiles = await listHtml(output);
const documents = new Map();
for (const filename of htmlFiles) documents.set(filename, await readFile(filename, 'utf8'));

for (const [filename, html] of documents) {
  const pagePath = `/${path.relative(output, filename).split(path.sep).join('/')}`.replace(/index\.html$/, '');
  for (const href of extractHtmlTargets(html)) {
    if (!href || href.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    let target;
    try { target = mapLocalUrlToFile(output, pagePath, href, base); }
    catch (error) { errors.push(`${path.relative(output, filename)}: ${error.message}`); continue; }
    if (!target) continue;
    let targetExists = false;
    try { targetExists = (await stat(target.filePath)).isFile(); } catch {}
    if (!targetExists) {
      errors.push(`${path.relative(output, filename)}: local asset/page is missing for ${href}`);
      continue;
    }
    if (target.fragment && target.filePath.endsWith('.html')) {
      const targetHtml = documents.get(target.filePath) ?? await readFile(target.filePath, 'utf8');
      if (!extractHtmlIds(targetHtml).has(target.fragment)) errors.push(`${path.relative(output, filename)}: anchor #${target.fragment} is missing in ${href}`);
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} generated HTML files and their local pages, assets, and anchors.`);
}

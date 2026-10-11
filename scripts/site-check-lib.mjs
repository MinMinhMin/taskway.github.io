import path from 'node:path';

export function mapLocalUrlToFile(outputDir, pagePath, href, base = '/') {
  const pageUrl = new URL(pagePath, 'https://docs.invalid');
  const target = new URL(href.replaceAll('&amp;', '&'), pageUrl);
  if (target.origin !== 'https://docs.invalid') return null;

  const prefix = `/${String(base).replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '');
  let pathname = decodeURIComponent(target.pathname);
  if (prefix) {
    if (!pathname.startsWith(`${prefix}/`) && pathname !== prefix) {
      throw new Error(`Local URL does not include the configured base path ${prefix}: ${target.pathname}`);
    }
    pathname = pathname.slice(prefix.length) || '/';
  }
  const normalized = path.posix.normalize(`/${pathname.replace(/^\/+/, '')}`);
  let relative = normalized.slice(1);
  if (!path.posix.extname(relative)) relative = `${relative.replace(/\/$/, '')}/index.html`;
  const filePath = path.resolve(outputDir, ...relative.split('/'));
  if (!filePath.startsWith(`${path.resolve(outputDir)}${path.sep}`)) throw new Error(`Local URL escapes the output directory: ${target.pathname}`);
  return { filePath, fragment: decodeURIComponent(target.hash.slice(1)), pathname: target.pathname };
}

export function extractHtmlTargets(html) {
  const targets = [];
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) targets.push(match[2]);
  return targets;
}

export function extractHtmlIds(html) {
  return new Set([...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2]));
}

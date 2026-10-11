export function getBasePath(basePath = '') {
  const clean = String(basePath).replace(/^\/+|\/+$/g, '');
  return clean ? `/${clean}` : '';
}

export function getArticleTarget(url, { locale, slug, basePath = '' }) {
  if (!url.startsWith('../')) return url;
  const pageBase = `${getBasePath(basePath)}/${locale}/docs/${slug}/`;
  const target = new URL(url, `https://docs.invalid${pageBase}`);
  return `${target.pathname}${target.search}${target.hash}`;
}

export function rewriteArticleLinks(tree, options) {
  function walk(node) {
    if (node.type === 'link' && typeof node.url === 'string') node.url = getArticleTarget(node.url, options);
    for (const child of node.children || []) walk(child);
  }
  walk(tree);
  return tree;
}

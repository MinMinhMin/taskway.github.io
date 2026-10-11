export function checkArticlePairs(articles) {
  const errors = [];
  const byKey = new Map();
  for (const article of articles) {
    const group = byKey.get(article.translationKey) || new Map();
    group.set(article.locale, article);
    byKey.set(article.translationKey, group);
  }

  for (const [key, locales] of byKey) {
    for (const locale of ['en', 'vi']) {
      if (!locales.has(locale)) errors.push(`${key}: missing ${locale} translation`);
    }
    const en = locales.get('en');
    const vi = locales.get('vi');
    if (en && vi && JSON.stringify(en.sections) !== JSON.stringify(vi.sections)) {
      errors.push(`${key}: section IDs differ between en and vi`);
    }
  }
  return errors;
}

export function extractLocalLinks(markdown) {
  const body = markdown.replace(/^```[\s\S]*?^```\s*$/gm, '');
  return [...body.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('./') || href.startsWith('../') || href.startsWith('/') || href.startsWith('#'));
}

export function checkSnippetReferences(markdown, snippets) {
  const errors = [];
  for (const [, snippetPath] of markdown.matchAll(/\bsnippet=([^\s}]+)/g)) {
    const code = snippets.get(snippetPath);
    if (code === undefined) errors.push(`snippet is missing: ${snippetPath}`);
    else if (!code.trim()) errors.push(`snippet is empty: ${snippetPath}`);
  }
  return errors;
}

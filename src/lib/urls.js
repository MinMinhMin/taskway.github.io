export const LOCALES = Object.freeze(['en', 'vi']);

function normalizeBase(base = '/') {
  const path = `/${String(base).trim().replace(/^\/+|\/+$/g, '')}`;
  return path === '/' ? '' : path;
}

function localeIndex(pathname) {
  return pathname.split('/').findIndex((segment) => LOCALES.includes(segment));
}

export function getLocaleFromPath(pathname) {
  const segments = pathname.split('/');
  const index = localeIndex(pathname);
  return index >= 0 ? segments[index] : null;
}

export function getLocalizedUrl(base, locale, path = '/') {
  if (!LOCALES.includes(locale)) throw new RangeError(`Unsupported locale: ${locale}`);
  const { pathname, search, hash } = new URL(path, 'https://docs.invalid');
  const cleanPath = pathname === '/' ? '' : `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  return `${normalizeBase(base)}/${locale}${cleanPath}/${search}${hash}`;
}

export function getOtherLocaleUrl(pathname, locale, base = '/') {
  if (!LOCALES.includes(locale)) throw new RangeError(`Unsupported locale: ${locale}`);
  const index = localeIndex(pathname);
  if (index < 0) {
    const { pathname: path, search, hash } = new URL(pathname, 'https://docs.invalid');
    const cleanBase = normalizeBase(base);
    const route = path.slice(cleanBase.length) || '/';
    return getLocalizedUrl(base, locale, `${route}${search}${hash}`);
  }
  const segments = pathname.split('/');
  segments[index] = locale;
  return segments.join('/');
}

export function getCanonicalUrl(siteUrl, base, pathname) {
  if (!siteUrl) return null;
  const prefix = normalizeBase(base);
  const routePath = `/${String(pathname).replace(/^\/+/, '')}`;
  const fullPath = prefix && (routePath === prefix || routePath.startsWith(`${prefix}/`))
    ? routePath
    : `${prefix}${routePath}`;
  return new URL(fullPath || '/', siteUrl).href;
}

export function resolveStartupLocale(pathname, { savedLocale, browserLanguages = [] } = {}) {
  const routeLocale = getLocaleFromPath(pathname);
  if (routeLocale) return routeLocale;
  if (LOCALES.includes(savedLocale)) return savedLocale;
  return browserLanguages.some((language) => String(language).toLowerCase().startsWith('vi')) ? 'vi' : 'en';
}

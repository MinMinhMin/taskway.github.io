const body = document.body;
const locale = body.dataset.locale || 'en';

function rememberLocale(value) {
  try { localStorage.setItem('gateway-docs-locale', value); } catch {}
}

document.querySelectorAll('.language-switch a, [data-language-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    rememberLocale(link.href.includes('/vi/') ? 'vi' : 'en');
    const target = new URL(link.href);
    target.search = location.search;
    target.hash = location.hash;
    if (target.href !== link.href) {
      event.preventDefault();
      location.assign(target.href);
    }
  });
});

const themeButton = document.querySelector('[data-theme-toggle]');
themeButton?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0c1020' : '#f7f7fc');
  try { localStorage.setItem('gateway-docs-theme', next); } catch {}
});

const sidebar = document.querySelector('[data-sidebar]');
const menuButton = document.querySelector('[data-menu-toggle]');
function closeMenu() {
  document.documentElement.classList.remove('nav-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  const open = document.documentElement.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
sidebar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
let pagefind;
let searchTimer;

function dismissSearch() {
  if (!results || results.hidden) return;
  results.hidden = true;
  results.replaceChildren();
  form?.classList.remove('search-open');
}

function resultPath(url) {
  const base = body.dataset.base || '/';
  const prefix = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;
  if (url.startsWith(prefix) && prefix) return url;
  return `${prefix}/${url.replace(/^\/+/, '')}` || '/';
}

async function updateSearch() {
  if (!input || !results || !form) return;
  const query = input.value.trim();
  results.replaceChildren();
  if (!query) {
    dismissSearch();
    return;
  }
  results.hidden = false;
  form.classList.add('search-open');
  const heading = document.createElement('p');
  heading.className = 'search-result-label';
  heading.textContent = locale === 'vi' ? 'KẾT QUẢ TÌM KIẾM' : 'SEARCH RESULTS';
  results.append(heading);
  try {
    if (!pagefind) pagefind = await import(/* @vite-ignore */ `${body.dataset.searchBundle}pagefind.js`);
    const search = await pagefind.search(query);
    const items = await Promise.all(search.results.map((item) => item.data()));
    const sameLocale = items.filter((item) => item.filters?.locale?.includes(locale));
    if (!sameLocale.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = locale === 'vi' ? 'Chưa tìm thấy kết quả phù hợp. Hãy thử từ khóa khác.' : 'No results found. Try another search.';
      results.append(empty);
      return;
    }
    for (const item of sameLocale.slice(0, 8)) {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = resultPath(item.url);
      const label = document.createElement('strong');
      label.textContent = item.meta?.title || item.url;
      const excerpt = document.createElement('span');
      excerpt.innerHTML = item.excerpt;
      link.append(label, excerpt);
      link.addEventListener('click', dismissSearch);
      results.append(link);
    }
  } catch {
    results.replaceChildren(heading);
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = locale === 'vi' ? 'Chức năng tìm kiếm chưa sẵn sàng. Hãy xem các bài trong danh mục.' : 'Search is unavailable. Browse the guide instead.';
    results.append(empty);
  }
}

form?.addEventListener('submit', (event) => { event.preventDefault(); void updateSearch(); });
input?.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => void updateSearch(), 150);
});
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    input?.focus();
    input?.select();
  } else if (event.key === 'Escape') {
    dismissSearch();
    closeMenu();
    input?.blur();
  }
});
document.addEventListener('pointerdown', (event) => {
  if (!form?.contains(event.target) && !results?.contains(event.target)) dismissSearch();
});

document.querySelectorAll('.article-content pre').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-wrap';
  pre.before(wrapper);
  wrapper.append(pre);
  const language = pre.querySelector('code')?.className.match(/language-([\w-]+)/)?.[1] || 'code';
  const toolbar = document.createElement('div');
  toolbar.className = 'code-toolbar';
  const languageTag = document.createElement('span');
  languageTag.textContent = language;
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-button';
  copy.textContent = locale === 'vi' ? 'Sao chép' : 'Copy';
  copy.setAttribute('aria-label', locale === 'vi' ? 'Sao chép đoạn mã' : 'Copy code');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText);
      copy.textContent = locale === 'vi' ? 'Đã sao chép' : 'Copied';
      setTimeout(() => { copy.textContent = locale === 'vi' ? 'Sao chép' : 'Copy'; }, 1600);
    } catch {
      copy.textContent = locale === 'vi' ? 'Không sao chép được' : 'Copy failed';
    }
  });
  toolbar.append(languageTag, copy);
  wrapper.prepend(toolbar);
});

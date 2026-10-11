export const SUPPORTED_LOCALES = Object.freeze(['en', 'vi']);

export const UI = Object.freeze({
  en: {
    home: 'Docs home',
    search: 'Search docs',
    searchHint: 'Search by API, feature, or error code…',
    language: 'Language',
    theme: 'Toggle color theme',
    menu: 'Open navigation',
    close: 'Close',
    onThisPage: 'On this page',
    previous: 'Previous',
    next: 'Next',
    copy: 'Copy',
    copied: 'Copied',
    noResults: 'No results found. Try another search.',
    selectLanguage: 'Choose a language',
    backToTop: 'Back to top',
    searchUnavailable: 'Search is unavailable. Browse the guide instead.',
    app: 'Open AI Gateway',
    editOnGithub: 'Edit this page',
    notFound: 'Page not found',
  },
  vi: {
    home: 'Trang chủ tài liệu',
    search: 'Tìm trong tài liệu',
    searchHint: 'Tìm API, tính năng hoặc mã lỗi…',
    language: 'Ngôn ngữ',
    theme: 'Đổi giao diện sáng/tối',
    menu: 'Mở danh mục',
    close: 'Đóng',
    onThisPage: 'Trong bài này',
    previous: 'Bài trước',
    next: 'Bài tiếp theo',
    copy: 'Sao chép',
    copied: 'Đã sao chép',
    noResults: 'Chưa tìm thấy kết quả phù hợp.',
    selectLanguage: 'Chọn ngôn ngữ',
    backToTop: 'Lên đầu trang',
    searchUnavailable: 'Chức năng tìm kiếm chưa sẵn sàng. Bạn có thể xem các bài trong danh mục.',
    app: 'Mở AI Gateway',
    editOnGithub: 'Sửa bài này trên GitHub',
    notFound: 'Không tìm thấy trang',
  },
});

export function getMissingTranslations(slugsByLocale) {
  const slugSets = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, new Set(slugsByLocale[locale] ?? [])]),
  );
  const allSlugs = new Set(Object.values(slugSets).flatMap((set) => [...set]));
  return SUPPORTED_LOCALES.flatMap((locale) =>
    [...allSlugs].filter((slug) => !slugSets[locale].has(slug)).map((slug) => ({ locale, slug })),
  ).sort((a, b) => a.slug.localeCompare(b.slug) || a.locale.localeCompare(b.locale));
}

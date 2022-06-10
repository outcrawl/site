export const routerRedirects = {
  home: {
    index: '/',
    page: (page: number): string => (page === 1 ? '/' : `/page/${page}`),
  },
  article: (slug: string) => `/${slug}`,
  author: (slug: string) => `/authors/${slug}`,
  privacy: '/privacy',
  about: '/about',
  tags: {
    index: '/tags',
    tag: (slug: string) => ({
      index: `/tags/${slug}`,
      page: (page: number) =>
        page === 1 ? `/tags/${slug}` : `/tags/${slug}/page/${page}`,
    }),
  },
};

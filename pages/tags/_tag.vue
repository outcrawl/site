<script>
import TagPage from '~/components/TagPage';

export default {
  asyncData({ params }) {
    if (process.server) {
      // Paginate articles
      const page = parseInt(params.page) || 1;
      const perPage = process.env.articlesPerPage;
      const articles = require('~/tools/fetch-articles')()
        .filter(a => a.tags.find(tag => tag.slug === params.tag))
        .splice((page - 1) * perPage, perPage);
      // Get tag object from an article
      const tag = articles[0].tags.find(tag => tag.slug == params.tag);
      return {
        tag,
        page,
        articles,
      };
    }
  },
  render(createElement) {
    return createElement(TagPage, {
      props: {
        tag: this.tag,
        articles: this.articles,
        page: this.page,
        perPage: process.env.articlesPerPage,
        total: this.articles.length,
      },
    });
  },
};
</script>

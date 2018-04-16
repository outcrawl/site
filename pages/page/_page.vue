<script>
import HomePage from '~/components/HomePage';

export default {
  asyncData({ params }) {
    if (process.server) {
      // Paginate articles
      const page = parseInt(params.page);
      const perPage = process.env.articlesPerPage;
      const articles = require('~/tools/fetch-articles')();
      return {
        page,
        articles: articles.splice((page - 1) * perPage, perPage),
        total: articles.length,
        perPage: process.env.articlesPerPage,
      };
    }
  },
  render(createElement) {
    return createElement(HomePage, {
      props: {
        articles: this.articles,
        page: this.page,
        perPage: this.perPage,
        total: this.total,
      },
    });
  },
};
</script>

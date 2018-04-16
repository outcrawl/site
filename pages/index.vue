<script>
import HomePage from '~/components/HomePage';

export default {
  asyncData() {
    if (process.server) {
      // Paginate articles
      const page = 1;
      const perPage = process.env.articlesPerPage;
      const articles = require('~/tools/fetch-articles')().splice((page - 1) * perPage, perPage);
      return {
        page,
        articles,
      };
    }
  },
  render(createElement) {
    return createElement(HomePage, {
      props: {
        articles: this.articles,
        page: this.page,
        perPage: process.env.articlesPerPage,
        total: this.articles.length,
      },
    });
  },
};
</script>

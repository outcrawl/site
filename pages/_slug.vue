<script>
import ArticlePage from '~/components/ArticlePage';
import GeneralPage from '~/components/GeneralPage';

export default {
  asyncData({ params }) {
    if (process.server) {
      const buildPage = require('~/tools/build-page').buildPage;
      const page = buildPage(params.slug);
      return {
        page,
      };
    }
  },
  render(createElement) {
    const page = this.page;
    if (page.type == 'page') {
      return createElement(GeneralPage, {
        props: { page: page },
      });
    } else {
      return createElement(ArticlePage, {
        props: { page: page },
      });
    }
  },
};
</script>

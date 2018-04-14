<script>
import Article from '~/components/Article';
import Page from '~/components/Page';

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
      return createElement(Page, {
        props: { page: page },
      });
    } else {
      return createElement(Article, {
        props: { page: page },
      });
    }
  },
};
</script>

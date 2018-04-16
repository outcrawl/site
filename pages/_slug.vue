<script>
import ArticlePage from '~/components/ArticlePage';
import GeneralPage from '~/components/GeneralPage';

export default {
  asyncData({ params }) {
    if (process.server) {
      const page = require('~/tools/build-page').buildPage(params.slug);
      page.assetMap = require('~/tools/copy-assets').linkAssets();
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

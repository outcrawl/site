<script>
import Page from '~/components/Page';
import Article from '~/components/Article';

export default {
  validate({ params }) {
    return [...process.env.pages, ...process.env.articles]
      .find(page => page.slug === params.slug) != null;
  },
  asyncData({ params }) {
    const page = [...process.env.pages, ...process.env.articles]
      .find(page => page.slug === params.slug);
    return { page };
  },
  render(createElement) {
    const page = this.page;
    if (page.type === 'page') {
      return createElement(Page, {
        props: { page },
      });
    } else {
      return createElement(Article, {
        props: { article: page, },
      });
    }
  }
};
</script>

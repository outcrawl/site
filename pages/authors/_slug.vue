<script>
import AuthorPage from '~/components/AuthorPage';

export default {
  asyncData({ params }) {
    if (process.server) {
      const author = require('~/tools/fetch-author')(params.slug);
      return { author };
    }
  },
  render(createElement) {
    return createElement(AuthorPage, {
      props: {
        author: this.author,
      },
    });
  },
};
</script>

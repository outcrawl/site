<template>
  <HomePage :articles="articles"
            :page="page"
            :perPage="perPage"
            :total="total" />
</template>

<script>
import HomePage from '~/components/HomePage';

export default {
  asyncData({ route }) {
    if (process.server) {
      // Paginate articles
      const page = parseInt(route.params.page);
      const perPage = process.env.articlesPerPage;
      const articles = require('~/tools/fetch-pages').fetchArticles();
      return {
        page,
        articles: articles.splice((page - 1) * perPage, perPage),
        total: articles.length,
        perPage: process.env.articlesPerPage,
      };
    }
  },
  components: { HomePage },
};
</script>

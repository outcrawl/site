<template>
  <Home :articles="articles"
        :page="page"
        :perPage="perPage"
        :total="total" />
</template>

<script>
import Home from '~/components/Home';

export default {
  asyncData({ route }) {
    // Paginate articles
    const page = parseInt(route.params.page);
    const perPage = process.env.articlesPerPage;
    const articles = process.env.articles
      .splice(page * perPage, perPage);
    return {
      page,
      articles,
      total: process.env.articles.length,
      perPage: process.env.articlesPerPage,
    };
  },
  components: {
    Home,
  },
};
</script>

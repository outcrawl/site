<template>
  <div>
    <h1>Home</h1>
    <ol>
      <li v-for="article of articles"
          :key="article.slug">
        <nuxt-link :to="`/${article.slug}/`">{{article.title}}</nuxt-link>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  asyncData() {
    return {
      articles: process.env.articles,
    };
  },
  head() {
    return {
      title: 'Home',
    };
  }
};
</script>

<template>
  <article>
    <div>
      <div v-html="page.html"></div>
    </div>
  </article>
</template>

<script>
export default {
  asyncData({ params }) {
    if (process.server) {
      const buildPage = require('~/tools/build-page').buildPage;
      const page = buildPage(params.slug);
      return {
        page,
      };
    }
  }
};
</script>

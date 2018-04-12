<template>
  <!--
  <article v-html="article.html">
  </article>
-->
  <pre>
    {{article.html}}
  </pre>
</template>

<script>
export default {
  name: 'Article',
  props: ['article'],
};
</script>

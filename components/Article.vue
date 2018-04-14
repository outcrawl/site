<template>
  <article class="container"
           v-html="page.html"></article>
</template>

<script>
export default {
  props: ['page'],
};
</script>

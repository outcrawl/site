<template>
  <article class="page"
           v-html="page.html"></article>
</template>

<script>
export default {
  props: ['page'],
};
</script>

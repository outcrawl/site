<template>
  <article>
    <h1>Article title</h1>
    <div>
      {{$route.params.slug}}
    </div>
  </article>
</template>

<script>
export default {
  /*
    layout: 'article',
    validate({ params }) {
      return params.slug === 'hello-world';
    },
    head() {
      return {
        title: 'Article',
      };
    },
    */
};
</script>

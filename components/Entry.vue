<template>
  <div class="card bg-dark text-white"
       style="width:18rem">
    <img class="card-img"
         :src="article.coverUrl"
         alt="Card image">
    <div class="card-img-overlay">
      <nuxt-link :to="`/${article.slug}/`">
        <h5 class="card-title">{{article.title}}</h5>
      </nuxt-link>
      <p class="card-text">{{article.date}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['article'],
};
</script>

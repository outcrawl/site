<template>
  <div class="entry">
    <div class="entry__content">
      <img class="entry__image"
           :src="article.coverUrl"
           alt="Card image">
      <div class="entry__body">
        <nuxt-link :to="`/${article.slug}/`">
          <h3 class="entry__title">{{article.title}}</h3>
        </nuxt-link>
        <p class="entry__date">{{article.date}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['article'],
};
</script>

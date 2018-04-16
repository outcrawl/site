<template>
  <div class="entry">
    <div class="entry__content">
      <nuxt-link class="entry__image"
                 :to="`/${article.slug}`">
        <img :src="article.coverUrl"
             alt="Card image">
      </nuxt-link>
      <div class="entry__body">
        <nuxt-link :to="`/${article.slug}`">
          <h3 class="entry__title">{{article.title}}</h3>
        </nuxt-link>
        <div class="entry__info">
          <img class="entry__author-avatar"
               :src="`https://www.gravatar.com/avatar/${article.author.emailHash}?s=120`"
               :alt="`${article.author.name} avatar`">
          <div class="entry__author">
            <nuxt-link class="entry__author-name"
                       :to="`/authors/${article.author.slug}`">{{article.author.name}}</nuxt-link>
            <span class="entry__date">{{article.date}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['article'],
};
</script>

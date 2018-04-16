<template>
  <article class="page">

    <h1>{{page.title}}</h1>

    <div class="page__meta">
      <div class="page__info">
        <img class="page__author-avatar"
             :src="`https://www.gravatar.com/avatar/${page.author.emailHash}?s=120`"
             :alt="`${page.author.name} avatar`">
        <div class="page__author">
          <nuxt-link class="page__author-name"
                     :to="`/authors/${page.author.slug}/`">{{page.author.name}}</nuxt-link>
          <span class="page__date">{{page.date}}</span>
        </div>
      </div>
      <div class="page__share">
        <a class="button button--icon button--twitter"
           :href="`https://twitter.com/intent/tweet?url=${page.permalink}&text=${page.title}`">
          <Twitter />
        </a>
        <a class="button button--icon button--facebook"
           :href="`https://www.facebook.com/sharer/sharer.php?u=${page.permalink}`">
          <Facebook />
        </a>
        <a class="button button--icon button--google-plus"
           :href="`https://plus.google.com/share?url=${page.permalink}`">
          <GooglePlus />
        </a>
      </div>
    </div>

    <img class="page__image"
         :src="page.assetMap[page.slug + '/cover.jpg']"
         :alt="page.title" />

    <span v-html="page.html"></span>

    <div class="page__meta">
      <div class="page__tags">
        <nuxt-link v-for="tag of page.tags"
                   :key="tag.slug"
                   class="page__tag"
                   :to="`/tags/${tag.slug}/`">{{tag.name}}</nuxt-link>
      </div>
      <div class="page__share">
        <a class="button button--icon button--twitter"
           :href="`https://twitter.com/intent/tweet?url=${page.permalink}&text=${page.title}`">
          <Twitter />
        </a>
        <a class="button button--icon button--facebook"
           :href="`https://www.facebook.com/sharer/sharer.php?u=${page.permalink}`">
          <Facebook />
        </a>
        <a class="button button--icon button--google-plus"
           :href="`https://plus.google.com/share?url=${page.permalink}`">
          <GooglePlus />
        </a>
      </div>
    </div>

  </article>
</template>

<script>
import Twitter from '~/assets/svg/twitter.svg';
import GitHub from '~/assets/svg/github.svg';
import Facebook from '~/assets/svg/facebook.svg';
import GooglePlus from '~/assets/svg/google-plus.svg';

export default {
  props: ['page'],
  components: {
    Twitter,
    GitHub,
    Facebook,
    GooglePlus,
  },
};
</script>

<template>
  <div class="page author">
    <div class="author__info">
      <img class="author__avatar"
           :src="`https://www.gravatar.com/avatar/${author.emailHash}?s=512`"
           :alt="`${author.name} avatar`">
      <h1 class="author__name">{{author.name}}</h1>
      <p class="author__bio">{{author.bio}}</p>
      <a class="author__mail"
         :href="`mailto:${author.email}`">{{author.email}}</a>
      <div class="author__social">
        <a class="author__social-link"
           v-if="author.social.twitter"
           :href="`https://twitter.com/${author.social.twitter}`">
          <Twitter class="author__social-icon" />
        </a>
        <a class="author__social-link"
           v-if="author.social.github"
           :href="`https://github.com/${author.social.github}`">
          <GitHub class="author__social-icon" />
        </a>
        <a class="author__social-link"
           v-if="author.social.facebook"
           :href="`https://www.facebook.com/${author.social.facebook}`">
          <Facebook class="author__social-icon" />
        </a>
        <a class="author__social-link"
           v-if="author.social.googlePlus"
           :href="`https://plus.google.com/${author.social.googlePlus}`">
          <GooglePlus class="author__social-icon" />
        </a>
      </div>
    </div>
    <hr>
    <div>
      <h2>Articles</h2>
      <div v-for="month of Object.keys(author.articlesByMonth)"
           :key="month">
        <h3 class="author__article-month">{{month}}</h3>
        <ul>
          <li v-for="article of author.articlesByMonth[month]"
              :key="article.slug">
            <nuxt-link class="author__article-title"
                       :to="`/${article.slug}`">
              {{article.title}}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Twitter from '~/assets/svg/twitter.svg';
import GitHub from '~/assets/svg/github.svg';
import Facebook from '~/assets/svg/facebook.svg';
import GooglePlus from '~/assets/svg/google-plus.svg';

export default {
  props: ['author'],
  components: {
    Twitter,
    GitHub,
    Facebook,
    GooglePlus,
  },
};
</script>

<template>
  <v-flex xs12 sm6
          style="height: 300px">

    <v-card hover
            class="my-3"
            height="100%"
            :href="`/${article.slug}/`"
            nuxt>
      <v-card-media class="white--text"
                    height="100%"
                    :src="article.coverUrl">
        <v-container fill-height
                     style="background: linear-gradient(0, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0) 100%)"
                     fluid>
          <v-layout>
            <v-flex xs12
                    align-end
                    d-flex>
              <span class="headline">{{ article.title }}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-media>
    </v-card>

  </v-flex>
</template>

<script>
export default {
  props: ['article'],
};
</script>

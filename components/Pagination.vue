<template>
  <div>
    <v-btn flat
           icon
           nuxt
           :href="page <= 1 ? '' : (page == 2 ? '/' : `/page/${page - 1}`)"
           :disabled="page <= 1">
      <v-icon>chevron_left</v-icon>
    </v-btn>
    <v-btn flat
           icon
           nuxt
           v-for="i in Math.ceil(total / perPage)"
           :href="i == 1 ? '/' : `/page/${i}`"
           :key="i"
           :class="{'btn--active': i == page}">
      <TextIcon>{{i}}</TextIcon>
    </v-btn>
    <v-btn flat
           icon
           nuxt
           :href="page == Math.ceil(total / perPage) ? '' : `/page/${page + 1}`"
           :disabled="page == Math.ceil(total / perPage)">
      <v-icon>chevron_right</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['page', 'perPage', 'total'],
};
</script>

<template>
  <div>
    <nuxt-link v-if="page > 0"
               :to="page <= 1 ? `/` : `/page/${page - 1}`">
      Prev
    </nuxt-link>

    <nuxt-link v-for="i in total / perPage"
               :to="i == 1 ? '/' : '/page/' + (i - 1)"
               :key="i">
      {{i}}
    </nuxt-link>

    <nuxt-link v-if="page < (total / perPage - 1)"
               :to="`/page/${page + 1}`">
      Next
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['page', 'perPage', 'total'],
};
</script>

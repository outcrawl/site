<template>
  <div>
    <h2>Home - Page {{page}}</h2>
    <ol>
      <li v-for="article of articles"
          :key="article.slug">
        <nuxt-link :to="`/${article.slug}/`">
          {{article.title}}
        </nuxt-link>
      </li>
    </ol>
    <Pagination :page="page"
                :perPage="perPage"
                :total="total" />
  </div>
</template>

<script>
import Pagination from '~/components/Pagination';

export default {
  name: 'Home',
  components: {
    Pagination,
  },
  props: ['articles', 'page', 'perPage', 'total'],
};
</script>

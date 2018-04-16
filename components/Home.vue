<template>
  <div class="home">
    <div class="home__entries">
      <Entry v-for="article of articles"
             :key="article.slug"
             :article="article" />
    </div>
    <Pagination class="home__pagination"
                :page="page"
                :perPage="perPage"
                :total="total" />
  </div>
</template>

<script>
import Entry from '@/components/Entry';
import Pagination from '~/components/Pagination';

export default {
  components: {
    Entry,
    Pagination,
  },
  props: ['articles', 'page', 'perPage', 'total'],
};
</script>

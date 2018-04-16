<template>
  <div class="page">
    <div class="page__entries">
      <Entry v-for="article of articles"
             :key="article.slug"
             :article="article" />
    </div>
    <Pagination class="page__pagination"
                :page="page"
                :perPage="perPage"
                :total="total"
                basePath="" />

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

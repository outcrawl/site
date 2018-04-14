<template>
  <div>
    <Entry v-for="article of articles"
           :key="article.slug"
           :article="article" />
    <Pagination :page="page"
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

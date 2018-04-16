<template>
  <div class="page">
    <h1>{{tag.name}}</h1>
    <div class="page__entries">
      <Entry v-for="article of articles"
             :key="article.slug"
             :article="article" />
    </div>
    <Pagination class="page__pagination"
                :page="page"
                :perPage="perPage"
                :total="total"
                :basePath="`/tags/${tag.slug}`" />
  </div>
</template>

<script>
import Entry from '~/components/Entry';
import Pagination from '~/components/Pagination';

export default {
  components: {
    Entry,
    Pagination,
  },
  props: ['tag', 'articles', 'page', 'perPage', 'total'],
};
</script>

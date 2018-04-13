<template>
  <v-content>
    <v-container grid-list-md
                 text-xs-center
                 :style="{ maxWidth: '1024px' }">
      <v-layout row
                wrap>
        <Entry v-for="article of articles"
               :key="article.slug"
               :article="article" />
      </v-layout>
      <v-layout row
                wrap>
        <v-flex xs12
                mt-4>
          <Pagination :page="page"
                      :perPage="perPage"
                      :total="total" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Entry from '@/components/Entry';
import Pagination from '~/components/Pagination';

export default {
  name: 'Home',
  components: {
    Entry,
    Pagination,
  },
  props: ['articles', 'page', 'perPage', 'total'],
};
</script>

<template>
  <nav>
    <ul class="pagination">
      <li class="pagination__item"
          :class="page == 1 ? 'disabled' : ''">
        <nuxt-link class="pagination__link"
                   v-if="page != 1"
                   :to="page == 2 ? '/' : `/page/${page - 1}/`">
          Previous
        </nuxt-link>
        <span class="pagination__link"
              v-if="page == 1">
          Previous
        </span>
      </li>
      <li class="pagination__item"
          v-for="i in pageCount"
          :class="i == page ? 'active' : ''"
          :key="i">
        <nuxt-link class="pagination__link"
                   :to="i == 1 ? '/' : `/page/${i}/`">{{i}}</nuxt-link>
      </li>
      <li class="pagination__item"
          :class="page == pageCount ? 'disabled' : ''">
        <nuxt-link class="pagination__link"
                   v-if="page != pageCount"
                   :to="`/page/${page + 1}/`">
          Next
        </nuxt-link>
        <span class="pagination__link"
              v-if="page == pageCount">
          Next
        </span>
      </li>
    </ul>
  </nav>
</template>

<script>
import ChevronLeft from '~/assets/svg/chevron-left.svg';
import ChevronRight from '~/assets/svg/chevron-right.svg';

export default {
  props: ['page', 'perPage', 'total'],
  components: {
    ChevronLeft,
    ChevronRight,
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.perPage + 1);
    },
  },
};
</script>

<template>
  <!--
  <div>
    <nuxt-link :to="page <= 1 ? '' : (page == 2 ? '' : `page/${page - 1}`)">
      <ChevronLeft width="16"
                   height="16" />
    </nuxt-link>
    <nuxt-link :to="i == 1 ? '' : `page/${i}`"
               v-for="i in Math.ceil(total / perPage)"
               :key="i">
      <span>{{i}}</span>
    </nuxt-link>
    <nuxt-link :to="page == Math.ceil(total / perPage) ? '' : `page/${page + 1}`">
      <ChevronRight width="16"
                    height="16" />
    </nuxt-link>
  </div>
  -->

  <ul class="pagination">
    <li class="page-item">
      <a class="page-link"
         href="#"
         aria-label="Previous">
        <span aria-hidden="true">
          <ChevronLeft width="16"
                       height="16" />
        </span>
        <span class="sr-only">Previous</span>
      </a>
    </li>

    <li class="page-item"
        v-for="i in Math.ceil(total / perPage)"
        :key="i">
      <nuxt-link class="page-link"
                 :to="i == 1 ? '' : `page/${i}`">{{i}}</nuxt-link>
    </li>

    <li class="page-item">
      <a class="page-link"
         href="#"
         aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>

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
};
</script>

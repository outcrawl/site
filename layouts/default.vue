<template>
  <div class="page-content">
    <Header />
    <Main>
      <nuxt />
    </Main>
    <Footer />
  </div>
</template>

<script>
import Main from '@/components/Main';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default {
  components: {
    Main,
    Header,
    Footer,
  },
};
</script>

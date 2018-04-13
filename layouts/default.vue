<template>
  <v-app light>
    <Toolbar />
    <nuxt />
    <Footer />
  </v-app>
</template>

<script>
import Toolbar from '@/components/Toolbar';
import Footer from '@/components/Footer';

export default {
  components: {
    Toolbar,
    Footer,
  },
};
</script>

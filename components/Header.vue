<template>
  <header>
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand"
         href="/">
        <LogoText height="30"
                  class="d-inline-block align-top" />
      </a>
    </nav>
  </header>
</template>

<script>
import LogoText from '~/assets/svg/logo-text.svg';

export default {
  components: { LogoText },
};
</script>

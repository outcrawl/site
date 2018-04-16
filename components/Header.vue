<template>
  <header>
    <nav class="header">
      <a class="header__brand"
         href="/">
        <LogoText class="header__logo" />
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

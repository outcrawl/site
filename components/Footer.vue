<template>
  <footer class="footer">
    <div class="footer__content">

      <ul class="footer__links">
        <li>
          <a href="https://github.com/tinrab">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://twitter.com/tinrab">
            Twitter
          </a>
        </li>
        <li>
          <nuxt-link to="/about/">
            About
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/privacy/">
            Privacy
          </nuxt-link>
        </li>
      </ul>

      <p class="footer__body">
        {{new Date().getUTCFullYear()}} &copy; Outcrawl. All rights reserved.
      </p>

    </div>
  </footer>
</template>

<script>
export default {};
</script>

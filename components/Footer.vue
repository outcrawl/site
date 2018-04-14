<template>
  <footer class="footer bg-light pt-3 pt-md-5 py-2 py-md-4">
    <div class="container">

      <div class="row">
        <div class="col-12">
          <ul class="list-unstyled social-logos">
            <li class="mr-4">
              <a href="https://twitter.com/tinrab">
                <Twitter class="icon"
                         width="16"
                         height="16" />
              </a>
            </li>
            <li class="mr-4">
              <a href="https://github.com/tinrab">
                <GitHub class="icon"
                        width="16"
                        height="16" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          &copy; {{new Date().getUTCFullYear()}} - Outcrawl
        </div>
      </div>

    </div>
  </footer>
</template>

<script>
import Twitter from '~/assets/svg/twitter.svg';
import GitHub from '~/assets/svg/github.svg';

export default {
  components: { Twitter, GitHub },
};
</script>

const generateRoutes = require('./tools/generate-routes').generateRoutes;
const copyAssets = require('./tools/copy-assets');

copyAssets.copyAssets();

module.exports = {
  // Headers of the page
  head: {
    title: 'Outcrawl',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  env: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://outcrawl.com' : 'http://localhost:3000',
    articlesPerPage: 4
  },
  modules: [
    '@nuxtjs/pwa'
  ],
  icon: {
    iconSrc: 'static/logo.png'
  },
  loading: false,
  css: [
    '~/assets/main.scss',
    'vuetify/src/stylus/main.styl'
  ],
  generate: {
   routes: generateRoutes()
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/global.js'
  ],
  build: {
    extend(config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    extractCSS: true,
    watch: ['data'],
    vendor: ['~/plugins/vuetify.js']
  },
}

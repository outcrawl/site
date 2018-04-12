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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' }
    ]
  },
  env: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://outcrawl.com' : 'http://localhost:3000',
    dataUrl: 'http://localhost:3001',
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
    '@/assets/main.scss'
  ],
  generate: {
   routes: generateRoutes()
  },
  build: {
    // Run ESLint on save
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    watch: ['data']
  },
}

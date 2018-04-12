const generateData = require('./plugins/generate-data');

const { pages } = generateData();

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
    pages: pages,
    articles: pages.filter(page => page.layout === 'article')
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
   routes: pages.map(page => '/' + page.slug)
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
    vendor: ['axios']
  },
}

const generateRoutes = require('./tools/generate-routes').generateRoutes;
const copyAssets = require('./tools/copy-assets');

copyAssets.copyAssets();

module.exports = {
  head: {
    title: 'Outcrawl',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,500,700' }],
  },
  env: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://outcrawl.com' : 'http://localhost:3000',
    articlesPerPage: 6,
  },
  modules: ['@nuxtjs/pwa'],
  icon: {
    iconSrc: 'static/logo.png',
  },
  loading: false,
  css: ['~/assets/scss/main.scss'],
  generate: {
    routes: generateRoutes(),
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type);
      },
    },
  },
  build: {
    extend(config, { isDev, isClient, isServer }) {
      const rule = config.module.rules.find(r => r.loader === 'url-loader');
      config.module.rules.splice(config.module.rules.indexOf(rule), 1);
      config.module.rules.push({
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: 'img/[name].[hash:8].[ext]',
        },
      });
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
        options: {
          svgo: {
            plugins: [{ removeDoctype: true }, { removeComments: true }],
          },
        },
      });
    },
    extractCSS: false,
    watch: ['data'],
  },
};

const path = require('path');

const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      {
        resolve: 'gatsby-remark-copy-linked-files',
        options: {
          destinationDir: './static',
        },
      },
      {
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 1280,
          linkImagesToOriginal: false,
          quality: 80,
        },
      },
      'transform-markdown',
    ],
  },
};

const plugins = [
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'data',
      path: path.resolve('./data/'),
    },
  },
  {
    resolve: 'gatsby-plugin-google-fonts',
    options: {
      fonts: ['Roboto+Mono|Roboto:300,400,500,700'],
    },
  },
  'gatsby-plugin-sass',
  'gatsby-plugin-react-svg',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-sharp',
  'gatsby-plugin-catch-links',
  'gatsby-plugin-jss',
  'gatsby-plugin-sitemap',
  'gatsby-transformer-sharp',
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-103565863-1',
    },
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'Outcrawl',
      short_name: 'Outcrawl',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'minimal-ui',
    },
  },
  {
    resolve: 'gatsby-plugin-favicon',
    options: {
      logo: './static/static/logo.svg',
      injectHTML: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        twitter: false,
        yandex: false,
        windows: false,
      },
    },
  },
  remark,
];

module.exports = {
  siteMetadata: {
    title: 'Outcrawl',
    description: 'Software development tutorials without nonsense',
    siteUrl:
      process.env.NODE_ENV == 'production'
        ? 'https://outcrawl.com'
        : 'http://localhost:3000',
    articlesPerPage: 6,
  },
  plugins,
};

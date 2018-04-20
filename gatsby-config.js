const path = require('path');

const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      /*
      {
        resolve: 'gatsby-remark-copy-linked-files',
        options: {
          destinationDir: './',
        },
      },*/
      {
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 1280,
          linkImagesToOriginal: false,
          quality: 100,
        },
      },
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
      fonts: ['Roboto:300,400,500,700'],
    },
  },
  'gatsby-plugin-sass',
  'gatsby-plugin-react-svg',
  'gatsby-plugin-react-helmet',
  'gatsby-transformer-sharp',
  'gatsby-plugin-catch-links',
  'gatsby-plugin-jss',
  remark,
  'gatsby-plugin-sitemap',
  {
    resolve: 'gatsby-plugin-purify-css',
    options: {
      styleId: 'gatsby-inlined-css',
      purifyOptions: {
        info: true,
        minify: true,
      },
    },
  },
];

module.exports = {
  siteMetadata: {
    title: 'Outcrawl',
    description: '',
    siteUrl:
      process.env.NODE_ENV == 'production'
        ? 'https://outcrawl.com'
        : 'http://localhost:3000',
    articlesPerPage: 6,
  },
  plugins,
};

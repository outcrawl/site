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
          quality: 70,
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
      fonts: ['Roboto:300,400,500,700'],
    },
  },
  'gatsby-plugin-sass',
  'gatsby-plugin-react-svg',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-sharp',
  'gatsby-plugin-catch-links',
  'gatsby-plugin-jss',
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
  'gatsby-transformer-sharp',
  remark,
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

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
          linkImagesToOriginal: false,
          quality: 90,
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
      path: `${__dirname}/data/`,
    },
  },
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      google: {
        families: ['Roboto+Mono|Roboto:300,400,500,700'],
      },
    },
  },
  'gatsby-plugin-react-svg',
  'gatsby-transformer-yaml',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-typescript',
  'gatsby-plugin-sharp',
  'gatsby-plugin-sitemap',
  'gatsby-transformer-sharp',
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-103565863-1',
    },
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: 'Outcrawl',
      short_name: 'Outcrawl',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'minimal-ui',
      icon: 'static/static/logo.png',
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
      process.env.NODE_ENV === 'production'
        ? 'https://outcrawl.com'
        : 'http://localhost:8000',
    articlesPerPage: 6,
    copyright: '2018 © Outcrawl. All rights reserved.',
    twitterId: '@tinrab',
    facebookId: '863987620425609',
  },
  plugins,
};

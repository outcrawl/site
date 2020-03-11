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
      {
        resolve: 'gatsby-remark-prismjs',
        options: {
          classPrefix: 'code-',
          inlineCodeMarker: null,
          aliases: {},
          showLineNumbers: false,
          noInlineHighlight: false,
          prompt: {
            global: true,
          },
        },
      },
    ],
  },
};

const plugins = [
  {
    resolve: 'gatsby-plugin-typescript',
    options: {
      isTSX: true,
      allExtensions: true,
    },
  },
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
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
  'gatsby-transformer-yaml',
  'gatsby-plugin-sass',
  'gatsby-plugin-material-ui',
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
    description: 'Software engineering without nonsense.',
    copyright: '2020 © Outcrawl. All rights reserved.',
    twitterId: '@tinrab',
    facebookId: '863987620425609',
    siteUrl: process.env.NODE_ENV === 'production'
      ? 'https://outcrawl.com'
      : 'http://localhost:8000',
    articlesPerPage: 6,
  },
  plugins,
};

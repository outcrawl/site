const siteUrl = process.env.NODE_ENV === 'production'
  ? 'https://outcrawl.com'
  : 'http://localhost:8000';

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
        resolve: 'gatsby-remark-autolink-headers',
        options: {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 4 24 16"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
          className: 'heading-link',
          maintainCase: true,
          removeAccents: true,
          isIconAfterHeader: true,
        },
      },
      'lower-headings',
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
      'gatsby-remark-katex',
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
      start_url: siteUrl + '/',
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
  'gatsby-plugin-react-helmet',
  remark,
];

module.exports = {
  siteMetadata: {
    siteUrl,
    title: 'Outcrawl',
    description: 'Software engineering without nonsense',
    copyright: '2020 © Outcrawl. All rights reserved.',
    twitterId: '@tinrab',
    facebookId: '863987620425609',
    articlesPerPage: 6,
    featuredImage: siteUrl + '/static/featured.jpg',
  },
  plugins,
};

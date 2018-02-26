const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      {
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 1280,
          linkImagesToOriginal: true,
          quality: 100
        }
      },
      {
        resolve: 'gatsby-remark-prismjs',
        options: {
          classPrefix: "gatsby-code-",
        },
      },
      'copy-linked-files',
      'transform-markdown',
    ]
  }
};

const custom = [
  'create-node-fields',
  'create-pages',
  {
    resolve: 'create-home',
    options: {
      articlesPerPage: 8
    }
  },
  'create-author-pages',
  {
    resolve: 'create-tag-pages',
    options: {
      articlesPerPage: 8
    }
  }
];

const analytics = {
  resolve: 'gatsby-plugin-google-analytics',
  options: {
    trackingId: 'UA-103565863-1'
  }
};

const manifest = {
  resolve: 'gatsby-plugin-manifest',
  options: {
    name: 'Outcrawl',
    short_name: 'Outcrawl',
    start_url: '/',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    display: 'minimal-ui'
  }
};

const favicons = {
  resolve: 'gatsby-plugin-favicon',
  options: {
    logo: './static/logo.svg',
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
        windows: false
      }
  }
};

module.exports = {
  siteMetadata: {
    title: 'Outcrawl',
    description: 'Software development tutorials without nonsense.',
    siteUrl: process.env.NODE_ENV == 'production' ? 'https://outcrawl.com' : 'http://localhost:8081',
    facebookPublisherUrl: 'https://www.facebook.com/outcrawl'
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/data/`,
      }
    },
    'gatsby-plugin-jss',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-catch-links',
    remark,
    analytics,
    manifest,
    favicons,
    'gatsby-plugin-sitemap',
    ...custom
  ]
}

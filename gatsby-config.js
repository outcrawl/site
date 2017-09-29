const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [{
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 1280,
          linkImagesToOriginal: true
        }
      },
      {
        resolve: 'gatsby-remark-prismjs',
        options: {
          classPrefix: 'language-',
        }
      },
      'copy-linked-files',
      'transform-markdown'
    ]
  }
};

const custom = [
  'create-node-fields',
  'create-pages',
  {
    resolve: 'create-home',
    options: {
      postsPerPage: 3
    }
  },
  'create-author-pages',
  {
    resolve: 'create-tag-pages',
    options: {
      postsPerPage: 3
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
    display: 'minimal-ui',
    icons: [{
        // Everything in /static will be copied to an equivalent
        // directory in /public during development and build, so
        // assuming your favicons are in /static/favicons,
        // you can reference them here
        src: '/favicons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/favicons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
};

module.exports = {
  siteMetadata: {
    title: 'Outcrawl',
    description: 'Software development tutorials without nonsense',
    siteUrl: process.env.NODE_ENV == 'production' ? 'https://outcrawl.com' : 'http://localhost:8000',
    keywords: ['software', 'development', 'tutorial', 'go', 'angular', 'typescript'],
    facebookPublisherUrl: 'https://www.facebook.com/outcrawl'
  },
  plugins: [{
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/data/`,
      }
    },
    'gatsby-plugin-purify-css',
    {
      resolve: 'gatsby-plugin-postcss-sass',
      options: {
        postCssPlugins: [
          require('postcss-import')(),
          require('autoprefixer')()
        ]
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-catch-links',
    remark,
    analytics,
    manifest,
    'gatsby-plugin-offline',
    'gatsby-plugin-sitemap',
    ...custom
  ],
}

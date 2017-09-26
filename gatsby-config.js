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
        name: 'src',
        path: `${__dirname}/src/`,
      }
    }, {
      resolve: 'gatsby-plugin-sass',
      options: {
        precision: 10,
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    remark,
    ...custom
  ],
}

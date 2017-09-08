const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      'gatsby-remark-copy-linked-files',
      {
        resolve: 'gatsby-remark-prismjs',
        options: {
          classPrefix: 'language-',
        }
      },
      {
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 1280,
          linkImagesToOriginal: true
        }
      }
    ]
  }
};

const sass = {
  resolve: 'gatsby-plugin-sass',
  options: {
    precision: 10
  }
};

const fs = {
  resolve: 'gatsby-source-filesystem',
  options: {
    name: 'data',
    path: `${__dirname}/data/`,
  }
};

const canonicalUrls = {
  resolve: 'gatsby-plugin-canonical-urls',
  options: {
    siteUrl: 'https://outcrawl.com',
  }
};

const manifest = {
  resolve: 'gatsby-plugin-manifest',
  options: {
    name: 'Outcrawl',
    short_name: 'Outcrawl',
    start_url: '/',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    display: 'minimal-ui'
  }
};

module.exports = {
  siteMetadata: {
    title: 'Outcrawl',
    description: 'Software development tutorials without nonsense',
    siteUrl: 'https://outcrawl.com'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    //'gatsby-plugin-favicon',
    'gatsby-plugin-catch-links',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    remark,
    sass,
    fs,
    canonicalUrls
  ]
}

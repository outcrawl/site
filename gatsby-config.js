const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [{
      resolve: 'gatsby-remark-prismjs',
      options: {
        classPrefix: 'language-',
      }
    }, {
      resolve: 'gatsby-remark-images',
      options: {
        maxWidth: 1280,
        linkImagesToOriginal: false
      }
    }, {
      resolve: 'gatsby-remark-copy-linked-files'
    }]
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
    name: 'src',
    path: `${__dirname}/src/`,
  }
};

const canonicalUrls = {
  resolve: 'gatsby-plugin-canonical-urls',
  options: {
    siteUrl: 'https://outcrawl.com',
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
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    remark,
    sass,
    fs,
    canonicalUrls
  ]
}

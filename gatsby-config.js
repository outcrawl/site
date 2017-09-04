module.exports = {
  siteMetadata: {
    title: 'Outcrawl',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        precision: 10
      }
    }
  ]
}

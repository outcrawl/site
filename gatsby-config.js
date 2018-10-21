const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      {
        resolve: 'gatsby-remark-images',
        options: {
          maxWidth: 1280,
          linkImagesToOriginal: false,
          quality: 80,
        },
      },
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
  'gatsby-transformer-yaml',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-offline',
  'gatsby-plugin-typescript',
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
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
  },
  plugins,
};

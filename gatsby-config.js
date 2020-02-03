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
          classPrefix: "code-",
        },
      }
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
  remark,
];

module.exports = {
  siteMetadata: {
    siteUrl: process.env.NODE_ENV === 'production'
      ? 'https://outcrawl.com'
      : 'http://localhost:8000',
    articlesPerPage: 6,
  },
  plugins,
};

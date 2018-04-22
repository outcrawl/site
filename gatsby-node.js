const StatsPlugin = require('stats-webpack-plugin');

const createNodeFields = require('./tools/create-node-fields');
const createPages = require('./tools/create-pages');
const createHome = require('./tools/create-home');
const createTags = require('./tools/create-tags');
const createAuthorPages = require('./tools/create-author-pages');

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === 'MarkdownRemark') {
    createNodeFields(boundActionCreators, node, getNode);
  }
};

exports.createPages = (params) => {
  return Promise.all([
    createPages(params),
    createHome(params),
    createTags(params),
    createAuthorPages(params),
  ]);
};

exports.modifyWebpackConfig = ({ config, stage }) => {
  config.plugin('stats', StatsPlugin, [
    '../webpack-stats.json',
    {
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/],
      profile: true,
    },
  ]);

  return config;
};

const path = require('path');
const {
  createFilePath
} = require('gatsby-source-filesystem');

const {
  createNodeFields
} = require('./plugins/create-node-fields');

exports.onCreateNode = params => {
  createNodeFields(params);
};

const {
  createPosts
} = require('./plugins/create-posts');
const {
  createTagPages
} = require('./plugins/create-tag-pages');
const {
  createPages
} = require('./plugins/create-pages');
const {
  createHome
} = require('./plugins/create-home');

exports.createPages = params => {
  createPosts(params);
  createPages(params);
  createTagPages(params);
  createHome(params);
};

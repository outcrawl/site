const path = require('path');
const {
  createFilePath
} = require('gatsby-source-filesystem');

const {
  createPostFields
} = require('./plugins/create-post-fields');
const {
  createPosts
} = require('./plugins/create-posts');
const {
  createTagPages
} = require('./plugins/create-tag-pages');
const {
  createHome
} = require('./plugins/create-home');

exports.onCreateNode = params => {
  createPostFields(params);
};

exports.createPages = params => {
  createPosts(params);
  createTagPages(params);
  createHome(params);
};

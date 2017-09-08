const path = require('path');

const {
  createNodeFields
} = require('./plugins/create-node-fields');

exports.onCreateNode = params => {
  createNodeFields(params);
};

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
  createPages(params);
  createTagPages(params);
  createHome(params);
};

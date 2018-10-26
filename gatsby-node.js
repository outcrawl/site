const createNodeFields = require('./scripts/node-fields');
const createHome = require('./scripts/home');
const createPages = require('./scripts/pages');
const createAuthorPages = require('./scripts/authors');
const createTagListPage = require('./scripts/tag-list');

exports.onCreateNode = (params) => {
  createNodeFields(params);
};

exports.createPages = (params) => {
  return Promise.all([
    createHome(params),
    createPages(params),
    createAuthorPages(params),
    createTagListPage(params),
  ]);
};

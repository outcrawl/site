const createNodeFields = require('./scripts/create-node-fields');
const createHomePage = require('./scripts/create-home-page');
const createPages = require('./scripts/create-pages');
const createAuthorPages = require('./scripts/create-author-pages');
const createTagListPage = require('./scripts/create-tag-list-page');
const createTagPages = require('./scripts/create-tag-pages');

exports.onCreateNode = (params) => {
  createNodeFields(params);
};

exports.createPages = (params) => {
  return Promise.all([
    createHomePage(params),
    createPages(params),
    createAuthorPages(params),
    createTagListPage(params),
    createTagPages(params),
  ]);
};

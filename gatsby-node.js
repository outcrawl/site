const createNodeFields = require('./scripts/create-node-fields');
const createHomePage = require('./scripts/create-home-page');
const createPages = require('./scripts/create-pages');
const createAuthorPages = require('./scripts/create-author-pages');
// const createTagListPage = require('./scripts/tag-list');
// const createTagPages = require('./scripts/tag-pages');

exports.onCreateNode = (params) => {
  createNodeFields(params);
};

exports.createPages = (params) => {
  return Promise.all([
    createHomePage(params),
    createPages(params),
    createAuthorPages(params),
    // createTagListPage(params),
    // createTagPages(params),
  ]);
};

const createNodeFields = require('./scripts/create-node-fields');
const createHome = require('./scripts/create-home');
// const createPages = require('./scripts/create-pages');
// const createAuthorPages = require('./scripts/authors');
// const createTagListPage = require('./scripts/tag-list');
// const createTagPages = require('./scripts/tag-pages');

exports.onCreateNode = (params) => {
  createNodeFields(params);
};

exports.createPages = (params) => {
  return Promise.all([
    createHome(params),
    // createPages(params),
    // createAuthorPages(params),
    // createTagListPage(params),
    // createTagPages(params),
  ]);
};

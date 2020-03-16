const path = require('path');

module.exports = (params) => {
  const {
    actions: { createPage },
  } = params;
  const tagListTemplate = path.resolve('./src/templates/TagListTemplate.tsx');

  return createPage({
    path: '/tags',
    component: tagListTemplate,
  });
};

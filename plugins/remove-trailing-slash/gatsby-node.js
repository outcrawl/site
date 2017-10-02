exports.onCreatePage = ({
  page,
  boundActionCreators
}) => {
  const {
    createPage,
    deletePage
  } = boundActionCreators;
  return new Promise((resolve, reject) => {
    const oldPath = page.path;
    page.path = page.path === '/' ? page.path : page.path.replace(/\/$/, '');
    if (page.path !== oldPath) {
      deletePage({
        path: oldPath
      });
      createPage(page);
    }
    resolve();
  })
};

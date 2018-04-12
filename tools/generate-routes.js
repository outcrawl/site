const fs = require('fs-extra');

function generateRoutes() {
  const routes = [];
  for (const dir of fs.readdirSync('./data/articles')) {
    const slug = dir.substr(11);
    routes.push('/' + slug);
  }
  for (const dir of fs.readdirSync('./data/pages')) {
    routes.push('/' + dir);
  }
  return routes;
}

module.exports = {
  generateRoutes,
};

const md5File = require('md5-file');
const fs = require('fs-extra');

function getPaths(path, asset) {
  const src = path + '/' + asset;
  const hash = md5File.sync(src).substr(0, 5);
  const name = asset.substring(0, asset.lastIndexOf('.'));
  const dest = `./static/assets/${name}-${hash}.jpg`;
  return { src, dest };
}

function linkAssets() {
  const map = {};

  for (const dir of fs.readdirSync('./data/articles')) {
    const path = './data/articles/' + dir;
    const slug = dir.substr(11);

    for (const asset of fs.readdirSync(path)) {
      if (/.*.(jpg|png|gif)$/.test(asset)) {
        const name = asset.substring(0, asset.lastIndexOf('.'));
        const { src, dest } = getPaths(path, asset);
        map[`${slug}/${asset}`] = dest.substr('./static'.length);
      }
    }
  }

  return map;
}

function copyAssets() {
  for (const dir of fs.readdirSync('./data/articles')) {
    const path = './data/articles/' + dir;
    const slug = dir.substr(11);

    for (const asset of fs.readdirSync(path)) {
      if (/.*.(jpg|png|gif)$/.test(asset)) {
        const { src, dest } = getPaths(path, asset);
        fs.copySync(src, dest);
      }
    }
  }
}

module.exports = {
  linkAssets,
  copyAssets,
};

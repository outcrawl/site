// Modified https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-copy-linked-files

const visit = require('unist-util-visit');
const isRelativeUrl = require('is-relative-url');
const fsExtra = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const $ = require('cheerio');

module.exports = ({
  files,
  markdownNode,
  markdownAST,
  getNode
}) => {
  const filesToCopy = new Map();

  const visitor = link => {
    if (
      isRelativeUrl(link.url) &&
      getNode(markdownNode.parent).internal.type === 'File'
    ) {
      const linkPath = path.join(getNode(markdownNode.parent).dir, link.url);
      const linkPathUnix = linkPath.replace(/\\/g, '/');
      const linkNode = _.find(files, file => {
        if (file && file.absolutePath) {
          return file.absolutePath === linkPathUnix;
        }
        return null;
      });
      if (linkNode && linkNode.absolutePath) {
        const newPath = path.join(
          process.cwd(),
          'public/static',
          `${linkNode.internal.contentDigest}.${linkNode.extension}`
        );
        const relativePath = path.join(
          `/static/${linkNode.internal.contentDigest}.${linkNode.extension}`
        );
        link.url = relativePath;

        filesToCopy.set(linkPath, newPath);
      }
    }
  };

  visit(markdownAST, `link`, link => {
    visitor(link);
  });

  visit(markdownAST, 'image', image => {
    const imagePath = path.join(getNode(markdownNode.parent).dir, image.url);
    const imagePathUnix = imagePath.replace(/\\/g, '/');
    const imageNode = _.find(files, file => {
      if (file && file.absolutePath) {
        return file.absolutePath === imagePathUnix;
      }
      return false;
    })
    if (
      imageNode &&
      (imageNode.extension === `gif` || imageNode.extension === `svg`)
    ) {
      visitor(image);
    }
  });

  visit(markdownAST, 'html', node => {
    if (node.value.startsWith('<img')) {
      let image = Object.assign(node, $.parseHTML(node.value)[0].attribs);
      image.url = image.src;
      image.type = 'image';
      image.position = node.position;

      const imagePath = path.join(getNode(markdownNode.parent).dir, image.url);
      const imagePathUnix = imagePath.replace(/\\/g, '/');
      const imageNode = _.find(files, file => {
        if (file && file.absolutePath) {
          return file.absolutePath === imagePathUnix;
        }
        return false;
      })
      if (
        imageNode &&
        (imageNode.extension === 'gif' || imageNode.extension === 'svg')
      ) {
        visitor(image);
      }
    }
  });

  return Promise.all(
    Array.from(filesToCopy, async([linkPath, newPath]) => {
      if (!fsExtra.existsSync(newPath)) {
        try {
          await fsExtra.copy(linkPath, newPath);
        } catch (err) {
          console.error('error copying file', err);
        }
      }
    })
  );
};

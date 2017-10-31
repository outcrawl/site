const {
  createFilePath
} = require('gatsby-source-filesystem');
const slug = require('slug');
const md5 = require('md5');
const {
  authors
} = require('../../data/authors');

exports.onCreateNode = ({
  node,
  getNode,
  boundActionCreators
}) => {
  const {
    createNodeField
  } = boundActionCreators;
  if (node.internal.type === 'MarkdownRemark') {
    let basePath = 'articles';
    if (node.frontmatter.layout === 'page') {
      basePath = 'pages';
    }

    // Slug
    let filePath = createFilePath({
      node,
      getNode,
      basePath: basePath
    });
    if (node.frontmatter.layout === 'article') {
      // Remove date
      filePath = filePath.substr(12);
    }
    createNodeField({
      node,
      name: 'slug',
      value: filePath
    });

    if (node.frontmatter.layout === 'article') {
      // Insert cover image
      const content = node.internal.content;
      const front = content.indexOf('---', 3) + 3;
      node.internal.content = content.substr(0, front) + '![](./cover.jpg)' + content.substr(front);

      // Author data
      const author = authors[node.frontmatter.author];
      createNodeField({
        node,
        name: 'authorData',
        value: {
          name: author.name,
          emailHash: md5(author.email.toLowerCase()),
          social: author.social
        }
      });

      // Sort tags
      node.frontmatter.tags = node.frontmatter.tags.sort();

      // Slugify tags
      createNodeField({
        node,
        name: 'slugTags',
        value: node.frontmatter.tags.map(tag => slug(tag, {
          lower: true
        }))
      });
    }
  }
};

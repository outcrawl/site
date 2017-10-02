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
    let basePath = 'posts';
    if (node.frontmatter.layout === 'page') {
      basePath = 'pages';
    }

    // Slug
    let pageSlug = createFilePath({
      node,
      getNode,
      basePath: basePath
    });
    if (pageSlug.endsWith('/')) {
      pageSlug = pageSlug.substr(0, pageSlug.length - 1);
    }
    createNodeField({
      node,
      name: 'slug',
      value: pageSlug
    });

    if (node.frontmatter.layout === 'post') {
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

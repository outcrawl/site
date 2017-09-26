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
    // Slug
    createNodeField({
      node,
      name: 'slug',
      value: createFilePath({
        node,
        getNode,
        basePath: 'pages'
      })
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
  } else if (node.internal.type === 'ImageSharp') {
    // Cover for post
    const path = node.id.split(/ +/)[0].split('/');
    if (path[path.length - 1] === 'cover.jpg') {
      const slug = path[path.length - 2];
      createNodeField({
        node,
        name: 'postSlug',
        value: `/${slug}/`
      });
    }
  }
};

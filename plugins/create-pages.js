const path = require('path');
const cheerio = require('cheerio');

function transformHTML(html) {
  const $ = cheerio.load(html);

  // Modify gifs
  $('img').each(function() {
    const src = $(this).attr('src');
    if (src && src.endsWith('.gif')) {
      $(this).css('display', 'block');
      $(this).css('margin-left', 'auto');
      $(this).css('margin-right', 'auto');
      $(this).css('max-width', '100%');
    }
  });

  // Lower heading level
  $('h1, h2, h3').each(function() {
    if ($(this).is('h1')) {
      $(this).replaceWith(`<h2>${$(this).text()}</h2>`);
    } else if ($(this).is('h2')) {
      $(this).replaceWith(`<h3>${$(this).text()}</h3>`);
    } else {
      $(this).replaceWith(`<h4>${$(this).text()}</h4>`);
    }
  });

  return $.html();
}

exports.createPages = (params) => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const pageTemplate = path.resolve('src/templates/general-page.jsx');
  const postTemplate = path.resolve('src/templates/post.jsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              html
              frontmatter {
                layout
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors)
        return;
      }

      for (const {
          node
        } of result.data.allMarkdownRemark.edges) {
        const ctx = {
          slug: node.fields.slug,
          html: transformHTML(node.html)
        };

        if (node.frontmatter.layout === 'post') {
          createPage({
            path: node.fields.slug,
            component: postTemplate,
            context: ctx
          });
        } else {
          createPage({
            path: node.fields.slug,
            component: pageTemplate,
            context: ctx
          });
        }
      }

      resolve();
    })
  });
};

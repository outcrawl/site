const path = require('path');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const slug = require('slug');

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
  const createHeading = (text, id, level) => `
      <h${level} id="${id}" class="page-heading">
        ${text}
        <a href="#${id}" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M16,6H13V7.9H16C18.26,7.9 20.1,9.73 20.1,12A4.1,4.1 0 0,1 16,16.1H13V18H16A6,6 0 0,0 22,12C22,8.68 19.31,6 16,6M3.9,12C3.9,9.73 5.74,7.9 8,7.9H11V6H8A6,6 0 0,0 2,12A6,6 0 0,0 8,18H11V16.1H8C5.74,16.1 3.9,14.26 3.9,12M8,13H16V11H8V13Z" />
          </svg>
        </a>
      </h${level}>
    `;
  $('h1, h2, h3').each(function() {
    $e = $(this);
    const id = slug($e.text(), {
      lower: true
    });
    if ($e.is('h1')) {
      $e.replaceWith(createHeading($e.text(), id, 2));
    } else if ($(this).is('h2')) {
      $e.replaceWith(createHeading($e.text(), id, 3));
    } else {
      $e.replaceWith(createHeading($e.text(), id, 4));
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
    resolve(
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
      })
    );
  });
};

import React from 'react';
import Link from 'gatsby-link';
import Wade from 'wade';

import Page from '../components/Page';
import PageSection from '../components/PageSection';

function parseParams(queryString) {
  var params = {};
  queryString.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
  });
  return params;
}

const Search = ({ data, location }) => {
  const articles = data.allMarkdownRemark.edges.map(({ node }) => ({ ...node.frontmatter, ...node.fields }));
  const params = parseParams(location.search);
  const searchQuery = params['q'];

  if (searchQuery) {
    const search = Wade(articles.map(article => article.title));
    const results = search(searchQuery);
    return (
      <Page>
        <PageSection>
          <h1>Results for "{searchQuery}"</h1>
        </PageSection>
        <PageSection>
          {results.length == 0 ? (
            <p>No results.</p>
          ) :
            results.map(({ index }) =>
              <Link
                style={{ display: 'block' }}
                key={index} to={articles[index].slug}>
                {articles[index].title}
              </Link>
            )}
        </PageSection>
      </Page>
    );
  } else {
    return <Page />;
  }
};

export default Search;

export const pageQuery = graphql`
query SearchPageQuery {
  allMarkdownRemark(filter: {frontmatter: {layout: {eq: "article"}}}) {
    edges {
      node {
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
  }
}
`;

import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Wade from 'wade';

import Page from '../components/Page';
import PageSection from '../components/PageSection';

const styles = theme => ({
  result: {
    display: 'block',
    lineHeight: 1.5
  }
});

function parseParams(queryString) {
  var params = {};
  queryString.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
  });
  return params;
}

const Search = ({ classes, data, location }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => ({ ...node.frontmatter, ...node.fields }));
  const params = parseParams(location.search);
  const searchQuery = params['q'];

  if (searchQuery) {
    const search = Wade(posts.map(post => post.title));
    const results = search(searchQuery);
    return (
      <Page>
        <PageSection>
          <h1>
            Results for "{searchQuery}"
        </h1>
        </PageSection>
        <PageSection>
          {results.map(({ index }) =>
            <Link key={index} className={classes.result} to={posts[index].slug}>{posts[index].title}</Link>
          )}
        </PageSection>
      </Page>
    );
  } else {
    return <Page />;
  }
};

export default withStyles(styles)(Search);

export const pageQuery = graphql`
query IndexLayoutQuery {
  allMarkdownRemark(filter: {frontmatter: {layout: {eq: "post"}}}) {
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

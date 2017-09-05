import React from 'react';
import Link from 'gatsby-link';

import Entry from '../components/Entry';

export default ({ data }) => (
  <div>
    {data.allMarkdownRemark.edges.map(({ node }) =>
      <Entry key={node.fields.slug} post={node} />
    )}
  </div>
);

export const query = graphql`
query IndexQuery {
  allMarkdownRemark(filter: {frontmatter: {layout: {eq: "post"}}}) {
    totalCount
    edges {
      node {
        frontmatter {
          title
          date(formatString: "DD MMMM, YYYY")
        }
        fields {
          slug
        }
      }
    }
  }
}
`;

import React from 'react';
import Link from 'gatsby-link';

import Pagination from '../components/Pagination';

export default ({data, pathContext}) => {
  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.floor(pathContext.total / pathContext.limit);
  const posts = data.allMarkdownRemark.edges
    .map(({ node }) => Object.assign({}, node.frontmatter, node.fields));

  return (
    <div>
      <div>
        {posts.map(post =>
          <div key={post.slug}>
            <h1>{post.title}</h1>
            <span>{post.date}</span>
          </div>
        )}
      </div>
      <Pagination page={page} total={total} />
    </div>
  );
}

export const query = graphql`
query HomeQuery($skip: Int!, $limit: Int!) {
  allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {layout: {eq: "post"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
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

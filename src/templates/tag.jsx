import React from 'react';
import Link from 'gatsby-link';

export default ({ data }) => {
  const posts = data.allMarkdownRemark.edges
    .map(({ node }) => Object.assign({}, node.frontmatter, node.fields));
  return (
    <div>
      {posts.map(post =>
        <div key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
        </div>
      )}
    </div>
  );
}

export const query = graphql`
query TagQuery($tag: [String]!) {
  allMarkdownRemark(filter: {frontmatter: {tags: {in: $tag}}}) {
    edges {
      node {
        frontmatter {
          title
          tags
        }
        fields {
          slug
        }
      }
    }
  }
}
`;

import React from 'react';
import Link from 'gatsby-link';

const TagPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
    .map(({ node }) => ({ ...node.frontmatter, ...node.fields }));
  return (
    <div>
      {posts.map(post =>
        <div key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
        </div>
      )}
    </div>
  );
};

export default TagPage;

export const pageQuery = graphql`
query TagPageQuery($tag: [String]!) {
  allMarkdownRemark(filter: {frontmatter: {tags: {in: $tag}}}) {
    edges {
      node {
        frontmatter {
          title
          author
          tags
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

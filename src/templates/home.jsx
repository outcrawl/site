import React from 'react';
import Link from 'gatsby-link';

import Page from '../components/Page';
import Entry from '../components/Entry';
import Pagination from '../components/Pagination';

const HomePage = props => {
  const { data, pathContext } = props;
  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.floor(pathContext.total / pathContext.limit);
  const posts = data.allMarkdownRemark.edges
    .map(({ node }) => ({ ...node.frontmatter, ...node.fields }));

  return (
    <Page>
      {posts.map(post =>
        <Entry key={post.slug} post={post} />
      )}
      <Pagination page={page} total={total} basePath={'/'} />
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
query HomePageQuery($skip: Int!, $limit: Int!) {
  allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {layout: {eq: "post"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          author
          date(formatString: "DD MMMM, YYYY")
        }
        fields {
          slug
          authorData {
            name
            emailHash
          }
        }
      }
    }
  }
}
`;

import React from 'react';
import Link from 'gatsby-link';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Entry from '../components/Entry';
import Pagination from '../components/Pagination';
import FeaturedImage from '../images/featured.jpg';

const TagPage = props => {
  const { data, pathContext } = props;
  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.floor(pathContext.total / pathContext.limit);
  const { tag, basePath } = pathContext;

  const posts = data.allMarkdownRemark.edges
  .map(({ node: post }) => {
    const coverImage = data.allImageSharp.edges.find(({ node: image }) => image.fields.postSlug == post.fields.slug);
    return {
      ...post.frontmatter,
      ...post.fields,
      cover: coverImage ? coverImage.node.original.src : null
    };
  });

  return (
    <Page>
      <PageSection>
        <h1>
          {tag}
        </h1>
      </PageSection>
      {posts.map(post =>
        <Entry key={post.slug} post={post} />
      )}
      <Pagination page={page} total={total} basePath={basePath} />
    </Page>
  );
};

export default TagPage;

export const pageQuery = graphql`
query TagPageQuery($tag: [String]!, $skip: Int!, $limit: Int!) {

  allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {tags: {in: $tag}}}) {
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
          authorData {
            name
            emailHash
          }
        }
      }
    }
  }

  allImageSharp(filter: {fields: {postSlug: {ne: null}}}) {
    edges {
      node {
        original {
          src
        }
        fields {
          postSlug
        }
      }
    }
  }

}
`;

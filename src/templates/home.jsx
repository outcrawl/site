import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import Entry from '../components/Entry';
import Pagination from '../components/Pagination';
import FeaturedImage from '../images/featured.jpg';

const HomePage = props => {
  const { data, pathContext } = props;
  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.floor(pathContext.total / pathContext.limit);
  const posts = data.allMarkdownRemark.edges
    .map(({ node: post }) => {
      const coverImage = data.allImageSharp.edges.find(({ node: image }) => image.fields.postSlug == post.fields.slug);
      return {
        ...post.frontmatter,
        ...post.fields,
        cover: coverImage ? coverImage.node.original.src : null
      };
    });
  const siteMeta = data.site.siteMetadata;

  return (
    <Page>
      <Helmet>
        <title>{siteMeta.title}</title>
        <meta name="title" content={`${siteMeta.title} - ${siteMeta.description}`} />
        <meta name="description" content={siteMeta.description} />

        <meta name="keywords" content={siteMeta.keywords.join(',')} />
        <meta property="og:title" content={`${siteMeta.title} - ${siteMeta.description}`} />
        <meta property="og:url" content={siteMeta.siteUrl} />
        <meta property="og:description" content={siteMeta.description} />
        <meta property="og:site_name" content={siteMeta.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={FeaturedImage} />
        <meta name="twitter:description" content={siteMeta.description} />
        <meta name="twitter:image:src" content={FeaturedImage} />
        <meta name="twitter:site" content="@tinrab" />
        <meta name="twitter:creator" content="@tinrab" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="al:web:url" content={siteMeta.siteUrl} />
        <meta name="google" content="notranslate" />
      </Helmet>

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
  site {
    siteMetadata {
      title
      description
      siteUrl
      facebookPublisherUrl
      keywords
    }
  }
}
`;

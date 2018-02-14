import React from 'react';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import Pagination from '../components/Pagination';
import Entry from '../components/Entry';
import { SiteMeta, PageMeta } from '../components/Meta';

export default ({ data, pathContext }) => {
  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.ceil(pathContext.total / pathContext.limit);
  const siteMeta = data.site.siteMetadata;
  const articles = data.allMarkdownRemark.edges
    .map(({ node: article }) => ({
      ...article.frontmatter,
      ...article.fields,
      cover: siteMeta.siteUrl + article.frontmatter.cover.childImageSharp.original.src
    }));

  return (
    <Page>
      <SiteMeta siteMeta={siteMeta} />
      <PageMeta
        siteMeta={siteMeta}
        title={siteMeta.title}
        description={siteMeta.description}
        url={siteMeta.siteUrl + (page == 1 ? '' : `/page/${page}/`)}
      />
      {articles.map(article =>
        <Entry key={article.slug} article={article} />
      )}
      <Pagination page={page} total={total} basePath={'/'} />
    </Page>
  );
}

export const query = graphql`
query HomeQuery($skip: Int!, $limit: Int!) {
  allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {layout: {eq: "article"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          author
          date(formatString: "DD MMMM, YYYY")
          cover {
            childImageSharp {
              original {
                src
              }
            }
          }
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
  site {
    siteMetadata {
      title
      description
      siteUrl
      facebookPublisherUrl
    }
  }
}
`;

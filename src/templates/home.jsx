import React from 'react';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import Pagination from '../components/Pagination';
import Meta from '../components/Meta';
import Entry from '../components/Entry';

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
      <Meta siteMeta={siteMeta} />
      <Helmet>
        <title>{siteMeta.title}</title>
        <meta name="title" content={`${siteMeta.title} - ${siteMeta.description}`} />
        <meta name="description" content={siteMeta.description} />
        <link rel="canonical" href={`${siteMeta.siteUrl}${page == 1 ? '' : '/page/' + page + '/'}`} />

        <meta property="og:title" content={`${siteMeta.title} - ${siteMeta.description}`} />
        <meta property="og:url" content={siteMeta.siteUrl} />
        <meta property="og:description" content={siteMeta.description} />
        <meta property="og:site_name" content={siteMeta.title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:description" content={siteMeta.description} />
        <meta property="al:web:url" content={siteMeta.siteUrl} />
      </Helmet>

      {articles.map(article =>
        <Entry key={article.slug} article={article} />
      )}
      <Pagination page={page} total={total} basePath={'/'} />
    </Page>
  );
};

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
      keywords
    }
  }
}
`;

import React from 'react';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Entry from '../components/Entry';
import Pagination from '../components/Pagination';
import { SiteMeta, PageMeta } from '../components/Meta';

export default ({ data, pathContext }) => {
  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.ceil(pathContext.total / pathContext.limit);
  const { tag, basePath } = pathContext;
  const tagSlug = pathContext.tagSlug;
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
        title={`${tag} - ${siteMeta.title}`}
        description={`Articles about ${tag} on ${siteMeta.title}.`}
        url={`${siteMeta.siteUrl}/tags/${tagSlug}/`}
      />
      <PageSection>
        <h1>{tag}</h1>
      </PageSection>
      {articles.map(article =>
        <Entry key={article.slug} article={article} />
      )}
      <Pagination page={page} total={total} basePath={basePath} />
    </Page>
  );
}

export const query = graphql`
query TagPageQuery($tag: [String]!, $skip: Int!, $limit: Int!) {
  allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {tags: {in: $tag}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          author
          tags
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

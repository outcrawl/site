import React from 'react';
import Helmet from 'react-helmet';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Tags from '../components/article/Tags';
import Share from '../components/article/Share';
import Newsletter from '../components/Newsletter';
import Related from '../components/article/Related';
import Author from '../components/Author';
import Comments from '../components/article/Comments';
import { SiteMeta, ArticleMeta } from '../components/Meta';
import backend from '../utils/backend.js';

const styles = theme => ({
  article: {
  }
});

export default withStyles(styles)(({ data, pathContext, classes }) => {
  let article = {
    ...data.markdownRemark,
    ...data.markdownRemark.frontmatter,
    ...data.markdownRemark.fields,
    cover: data.markdownRemark.frontmatter.cover.childImageSharp.original
  };
  let related = data.related.edges.map(({ node: article }) => ({
    ...article.frontmatter,
    ...article.fields
  }));

  let siteMeta = data.site.siteMetadata;
  article.cover.src = siteMeta.siteUrl + article.cover.src;
  article.permalink = `${siteMeta.siteUrl}/${article.slug}`;
  article.authorData.slug = article.author;

  return (
    <Page narrow>
      <SiteMeta siteMeta={siteMeta} />
      <ArticleMeta
        siteMeta={siteMeta}
        article={article}
      />

      <PageSection className={classes.article} component="article">
        <h1>
          {article.title}
        </h1>

        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Author article={article} dark />
          </Grid>
          <Grid item sm={6}>
            <Share article={article} />
          </Grid>
        </Grid>

        <div dangerouslySetInnerHTML={{ __html: article.html }} />
      </PageSection>

      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Tags article={article} />
        </Grid>
        <Grid item sm={6}>
          <Share article={article} />
        </Grid>
      </Grid>

      <PageSection>
        <Newsletter />
      </PageSection>
      <PageSection>
        <Related slug={article.slug} articles={related} />
      </PageSection>
      <PageSection>
        <Comments article={article} />
      </PageSection>
    </Page>
  );
});

export const query = graphql`
query ArticleQuery($slug: String!, $tags: [String]!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
    html
    frontmatter {
      title
      description
      author
      tags
      date(formatString: "DD MMMM, YYYY")
      cover {
        childImageSharp {
          original {
            src
            width
            height
          }
        }
      }
    }
    fields {
      slug
      slugTags
      authorData {
        name
        emailHash
        social {
          twitter
          github
          facebook
          googlePlus
        }
      }
    }
  }

  related: allMarkdownRemark(filter: {frontmatter: {layout: {eq: "article"}, tags: {in: $tags}}}) {
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

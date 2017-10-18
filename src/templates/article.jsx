import React from 'react';
import Helmet from 'react-helmet';

import withStyles from '../components/ui/withStyles';
import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Grid from '../components/ui/Grid';
import Hidden from '../components/ui/Hidden';
import Tags from '../components/article/Tags';
import Share from '../components/article/Share';
import Newsletter from '../components/Newsletter';
import Thread from '../components/thread/Thread';
import Related from '../components/article/Related';
import Author from '../components/Author';
import backend from '../utils/backend.js';
import threadBuilder from '../utils/thread-builder.js';
import { SiteMeta, ArticleMeta } from '../components/Meta';

const styles = theme => ({
  article: {
    paddingBottom: '1rem'
  }
});

class Article extends React.Component {
  constructor({ data, pathContext }) {
    super();
    this.article = {
      ...data.markdownRemark,
      ...data.markdownRemark.frontmatter,
      ...data.markdownRemark.fields,
      cover: data.markdownRemark.frontmatter.cover.childImageSharp.original
    };
    this.related = data.related.edges.map(({ node: article }) => ({
      ...article.frontmatter,
      ...article.fields
    }));

    this.siteMeta = data.site.siteMetadata;
    this.article.cover.src = this.siteMeta.siteUrl + this.article.cover.src;
    this.article.permalink = `${this.siteMeta.siteUrl}${this.article.slug}`;
    this.article.authorData.slug = this.article.author;
    this.threadId = this.article.slug.replace(/^\/+|\/+$/g, '');
  }

  componentDidMount() {
    threadBuilder.init();
    backend.init();
  }

  render() {
    const classes = this.props.classes;
    const article = this.article;
    const siteMeta = this.siteMeta;
    return (
      <Page narrow>
        <SiteMeta siteMeta={siteMeta} />
        <ArticleMeta
          siteMeta={siteMeta}
          article={article}
        />

        <PageSection className={classes.article} component="article">
          <h1>
            {this.article.title}
          </h1>

          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Author article={this.article} dark />
            </Grid>
            <Grid item sm={6}>
              <Share article={this.article} />
            </Grid>
          </Grid>

          <div dangerouslySetInnerHTML={{ __html: this.article.html }} />
        </PageSection>

        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Tags article={this.article} />
          </Grid>
          <Grid item sm={6}>
            <Share article={this.article} />
          </Grid>
        </Grid>

        <PageSection>
          <Newsletter />
        </PageSection>
        <PageSection>
          <Related slug={article.slug} articles={this.related} />
        </PageSection>
        <PageSection>
          <Thread threadId={this.threadId} />
        </PageSection>
      </Page>
    );
  }
}

export default withStyles(styles)(Article);

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

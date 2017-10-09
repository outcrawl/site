import React from 'react';
import Helmet from 'react-helmet';

import withStyles from '../components/ui/withStyles';
import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Meta from '../components/Meta';
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
      ...data.markdownRemark.fields
    };
    this.related = data.related.edges.map(({ node: article }) => ({
      ...article.frontmatter,
      ...article.fields
    }));

    this.siteMeta = data.site.siteMetadata;
    this.article.permalink = `${this.siteMeta.siteUrl}${this.article.slug}`;
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
        <Meta page={article} siteMeta={siteMeta} />
        <Helmet>
          <title>{article.title}</title>
          <meta name="title" content={article.title} />
          <meta property="author" content={article.authorData.name} />
          <meta property="al:web:url" content={article.permalink} />

          <meta property="og:type" content="article" />
          <meta property="og:image" content={article.cover} />
          <meta name="twitter:image:src" content={article.cover} />

          {/* Article */}
          <meta property="article:published_time" content={new Date(Date.parse(article.date)).toISOString()} />
          <meta property="article:modified_time" content={new Date(Date.parse(article.date)).toISOString()} />
          <meta property="article:publisher" content={siteMeta.facebookPublisherUrl} />
          {article.keywords ? <meta name="keywords" content={article.keywords.join(',')} /> : ''}
          {article.tags.map(tag => <meta key={tag} property="article:tag" content={tag.toLowerCase()} />)}

          {/* Facebook */}
          <meta property="og:title" content={article.title} />
          {article.authorData.social.facebook ? <meta property="article:author" content={article.authorData.social.facebook} /> : ''}
          <meta property="og:url" content={article.permalink} />
          <meta property="og:image" content={article.coverSrc} />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720" />
          <meta property="og:description" content={article.description} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content={siteMeta.title} />

          {/* Twitter */}
          <meta name="twitter:description" content={article.description} />
          <meta name="twitter:image:src" content={article.cover} />
          <meta name="twitter:site" content="@tinrab" />
          <meta name="twitter:card" content="summary_large_image" />
          {article.authorData.social.twitter ? <meta name="twitter:creator" content={`@${article.authorData.social.twitter}`} /> : ''}
        </Helmet>

        <PageSection className={classes.article} component="article">
          <h1>
            {this.article.title}
          </h1>

          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Author article={this.article} dark />
            </Grid>
            <Grid item sm={6}>
              <Hidden xsDown>
                <Share article={this.article} />
              </Hidden>
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
      keywords
    }
  }
}
`;

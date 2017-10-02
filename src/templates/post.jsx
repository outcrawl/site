import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Tags from '../components/Post/Tags';
import Share from '../components/Post/Share';
import Newsletter from '../components/Post/Newsletter';
import Thread from '../components/Thread/Thread';
import Author from '../components/Author';
import Meta from '../components/Meta';
import backend from '../utils/backend.js';
import threadBuilder from '../utils/thread-builder.js';

const styles = theme => ({
  author: {
    marginBottom: 8
  },
  coverImage: {
    width: '100%',
    marginBottom: '1rem'
  }
});

class Post extends React.Component {
  constructor({ data, pathContext }) {
    super();
    this.meta = data.site.siteMetadata;
    this.post = data.markdownRemark;
    Object.assign(this.post, this.post.frontmatter);
    Object.assign(this.post, this.post.fields);
    this.post.permalink = `${this.meta.siteUrl}${this.post.slug}`;
    this.post.cover = this.meta.siteUrl + this.post.cover.childImageSharp.original.src;
    this.threadId = this.post.slug.substr(1);
  }

  componentDidMount() {
    threadBuilder.init();
    backend.init();
  }

  render() {
    const classes = this.props.classes;
    const post = this.post;
    const meta = this.meta;

    return (
      <Page contained={true}>
        <Meta page={post} siteMeta={meta} />
        <Helmet>
          <title>{post.title}</title>
          <meta name="title" content={post.title} />
          <meta property="author" content={post.authorData.name} />
          <meta property="al:web:url" content={post.permalink} />

          <meta property="og:type" content="article" />
          <meta property="og:image" content={post.cover} />
          <meta name="twitter:image:src" content={post.cover} />

          {/* Article */}
          <meta property="article:published_time" content={new Date(Date.parse(post.date)).toISOString()} />
          <meta property="article:modified_time" content={new Date(Date.parse(post.date)).toISOString()} />
          <meta property="article:publisher" content={meta.facebookPublisherUrl} />
          {post.keywords ? <meta name="keywords" content={post.keywords.join(',')} /> : ''}
          {post.tags.map(tag => <meta key={tag} property="article:tag" content={tag.toLowerCase()} />)}

          {/* Facebook */}
          <meta property="og:title" content={post.title} />
          {post.authorData.social.facebook ? <meta property="article:author" content={post.authorData.social.facebook} /> : ''}
          <meta property="og:url" content={post.permalink} />
          <meta property="og:image" content={post.coverSrc} />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720" />
          <meta property="og:description" content={post.description} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content={meta.title} />

          {/* Twitter */}
          <meta name="twitter:description" content={post.description} />
          <meta name="twitter:image:src" content={post.cover} />
          <meta name="twitter:site" content="@tinrab" />
          <meta name="twitter:card" content="summary_large_image" />
          {post.authorData.social.twitter ? <meta name="twitter:creator" content={`@${post.authorData.social.twitter}`} /> : ''}

        </Helmet>

        <PageSection component="article">
          <h1>
            {this.post.title}
          </h1>
          <Grid container spacing={0} className={classes.author}>
            <Grid item xs={12} sm={6}>
              <Author post={this.post} dark />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Share post={this.post} />
            </Grid>
          </Grid>
          <img
            className={classes.coverImage}
            src={this.post.cover}
            alt={this.post.title} />
          <div dangerouslySetInnerHTML={{ __html: this.post.html }} />
        </PageSection>
        <PageSection half>
          <Tags post={this.post} />
        </PageSection>
        <PageSection half>
          <Share post={this.post} />
        </PageSection>
        <PageSection>
          <Newsletter />
        </PageSection>
        <PageSection>
          <Thread threadId={this.threadId} />
        </PageSection>
      </Page>
    );
  }
}

export default withStyles(styles)(Post);

export const query = graphql`
query PostQuery($slug: String!) {
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

import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Tags from '../components/Post/Tags';
import Share from '../components/Post/Share';
import Newsletter from '../components/Post/Newsletter';
import Thread from '../components/Thread/Thread';
import Author from '../components/Author';
import Meta from '../components/Post/Meta';
import backend from '../utils/backend.js';
import threadBuilder from '../utils/thread-builder.js';

const styles = theme => ({
  author: {
    marginBottom: 8
  }
});

class Post extends React.Component {
  constructor(props) {
    super();
    const { data, pathContext } = props;
    const post = data.markdownRemark;
    Object.assign(post, post.frontmatter);
    Object.assign(post, post.fields);
    const html = pathContext.html;
    post.permalink = `${data.site.siteMetadata.siteUrl}${post.slug}`;

    this.post = post;
    this.html = html;
    this.threadId = post.slug.substr(1, post.slug.length - 2);
  }

  componentDidMount() {
    threadBuilder.init();
    backend.init();
  }

  render() {
    const classes = this.props.classes;
    return (
      <Page contained={true}>
        <Meta post={this.post} meta={this.props.data.site.siteMetadata} />
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
          <div dangerouslySetInnerHTML={{ __html: this.html }} />
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

export const pageQuery = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
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

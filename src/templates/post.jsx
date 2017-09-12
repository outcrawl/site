import React from 'react';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Tags from '../components/Post/Tags';
import Share from '../components/Post/Share';
import Newsletter from '../components/Post/Newsletter';
import Comments from '../components/Post/Comments';
import backend from '../utils/backend.js';

class Post extends React.Component {
  constructor(props) {
    super();

    backend.init();

    const { data, pathContext } = props;
    const post = data.markdownRemark;
    Object.assign(post, post.frontmatter);
    Object.assign(post, post.fields);
    const html = pathContext.html;
    post.permalink = `${data.site.siteMetadata.siteUrl}${post.slug}`;

    this.post = post;
    this.html = html;
  }

  render() {
    return (
      <Page contained={true}>
        <PageSection component="article">
          <h1>
            {this.post.title}
          </h1>
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
          <Comments threadId={this.post.slug} />
        </PageSection>
      </Page>
    );
  }
}

export default Post;

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
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

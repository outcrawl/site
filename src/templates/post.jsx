import React from 'react';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Tags from '../components/Post/Tags';
import Share from '../components/Post/Share';

const Post = props => {
  const { data, pathContext } = props;
  const post = data.markdownRemark;
  Object.assign(post, post.frontmatter);
  Object.assign(post, post.fields);
  const html = pathContext.html;
  post.permalink = `${data.site.siteMetadata.siteUrl}${post.slug}`;

  return (
    <Page contained={true}>
      <PageSection component="article">
        <h1>
          {post.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </PageSection>
      <PageSection half={true}>
        <Tags post={post} />
      </PageSection>
      <PageSection half={true}>
        <Share post={post} />
      </PageSection>
    </Page>
  );
};

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

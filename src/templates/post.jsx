import React from 'react';
import Link from 'gatsby-link';

import Page from '../components/Page';
import PageSection from '../components/PageSection';

const Tags = ({post}) => (
  <div>
    {post.tags.map((tag, i) =>
      <Link key={tag} to={`/tags/${post.slugTags[i]}`}>{tag}</Link>
    )}
  </div>
);

const Post = ({data, pathContext}) => {
  const post = data.markdownRemark;
  Object.assign(post, post.frontmatter);
  Object.assign(post, post.fields);
  const html = pathContext.html;

  return (
    <Page contained={true}>
      <PageSection component="article">
        <h1>
          {post.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </PageSection>
      <PageSection>
        <Tags post={post} />
      </PageSection>
    </Page>
  );
};

export default Post;

export const postQuery = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        author
        tags
        date(formatString: "DD MMMM, YYYY")
      }
      fields {
        slugTags
        authorData {
          name
          emailHash
        }
      }
    }
  }
`;

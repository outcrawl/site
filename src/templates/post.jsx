import React from 'react';
import Link from 'gatsby-link';

const Tags = props => (
  <div>
    {props.post.tags.map((tag, i) =>
      <Link to={`/tags/${props.post.slugTags[i]}`}>{tag}</Link>
    )}
  </div>
);

export default ({ data }) => {
  const post = data.markdownRemark;
  Object.assign(post, post.frontmatter);
  Object.assign(post, post.fields);

  return (
    <div>
      <h1>
        {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <Tags post={post} />
    </div>
  );
}

export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        tags
      }
      fields {
        slugTags
      }
    }
  }
`;

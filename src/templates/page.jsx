import React from 'react';
import Link from 'gatsby-link';

export default ({ data }) => {
  const page = data.markdownRemark;
  Object.assign(page, page.frontmatter);
  return (
    <div>
      <h1>
        {page.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
}

export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

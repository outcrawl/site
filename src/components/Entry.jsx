import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

const Entry = (props) => {
  const post = props.post;
  return (
    <div>
      <Link to={post.fields.slug}>
        {post.frontmatter.title}
      </Link>
    </div>
  );
};

export default Entry;

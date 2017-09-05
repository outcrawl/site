import React from 'react';
import Link from 'gatsby-link';

const Pagination = props => {
  let prevLink =
    <Link to={props.page === 2 ? '/' : `/page/${props.page - 1}`}>
      prev
    </Link>;
  let nextLink =
    <Link to={`/page/${props.page + 1}`}>
      next
    </Link>;

  const pages = [];
  for (let i = 1; i <= props.total; i++) {
    pages.push(<Link key={i} to={i === 1 ? '/' : `/page/${i}`}>{i}</Link>);
  }

  return (
    <div>
      {prevLink}
      {pages}
      {nextLink}
    </div>
  );
};

export default Pagination;

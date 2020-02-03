import React from 'react';
import { Link } from 'gatsby';
import { Chip } from '@material-ui/core';

type TagProps = {
  title: string;
  to: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Tag: React.FC<TagProps> = (props: TagProps) => {
  const { title, to, className } = props;
  return (
    <Link to={to} className={className}>
      <Chip onClick={() => null} label={title}/>
    </Link>
  );
};

export default Tag;

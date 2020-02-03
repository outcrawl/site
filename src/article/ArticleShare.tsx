import React from 'react';
import { ArticleInfo } from './types';

type ArticleShareProps = {
  info: ArticleInfo;
} & React.HTMLAttributes<HTMLDivElement>;

const ArticleShare: React.FC<ArticleShareProps> = (props: ArticleShareProps) => {
  const { className } = props;
  return (
    <div className={className}>Share</div>
  );
};

export default ArticleShare;

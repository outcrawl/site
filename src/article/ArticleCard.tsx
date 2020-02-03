import React from 'react';
import { ArticleInfo } from './types';
import { Card } from '@material-ui/core';

type ArticleCardProps = {
  info: ArticleInfo;
}

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
  const { info } = props;

  return (
    <Card>
      {info.title}
    </Card>
  );
};

export default ArticleCard;

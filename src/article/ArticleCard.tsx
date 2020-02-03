import React from 'react';
import { ArticleData } from './types';
import { Card } from '@material-ui/core';

type ArticleCardProps = {
  article: ArticleData;
}

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
  const {article} = props;

  return (
    <Card>
      {article.title}
    </Card>
  );
};

export default ArticleCard;

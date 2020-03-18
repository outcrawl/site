import { Box, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ArticleCard from './ArticleCard';
import { ArticleData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  article: {
    padding: theme.spacing(0.5),
    maxWidth: '50%',
  },
}));

type ArticleCardGridProps = {
  articles: ArticleData[];
};

const ArticleCardGrid: React.FC<ArticleCardGridProps> = (props: ArticleCardGridProps) => {
  const { articles } = props;
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      {articles.map((article) => (
        <Box
          key={article.slug}
          className={classes.article}
          flexGrow={1}
          flexShrink={0}
        >
          <ArticleCard article={article}/>
        </Box>
      ))}
    </Box>
  );
};

export default ArticleCardGrid;

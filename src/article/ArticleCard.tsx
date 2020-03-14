import React from 'react';
import { ArticleData } from './types';
import { Box, Card, CardContent, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import AuthorCard from '../author/AuthorCard';
import Img from 'gatsby-image';

const useStyles = makeStyles((theme: Theme) => createStyles({
  titleLink: {
    color: theme.palette.text.primary,
  },
}));

type ArticleCardProps = {
  article: ArticleData;
}

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
  const { article } = props;
  const classes = useStyles();

  return (
    <Card>
      {article.cover && (
        <Link to={'/' + article.slug}>
          <Img fluid={article.cover}/>
        </Link>
      )}
      <CardContent>
        <Link to={'/' + article.slug} className={classes.titleLink}>
          <Typography variant="h5">
            {article.title}
          </Typography>
        </Link>
      </CardContent>
      <Box p={2} pt={0}>
        {article.author && <AuthorCard author={article.author} subtitle={article.date}/>}
      </Box>
    </Card>
  );
};

export default ArticleCard;

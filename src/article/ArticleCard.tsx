import { Box, Card, CardContent, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import AuthorCard from '../author/AuthorCard';
import { ArticleData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  titleLink: {
    color: theme.palette.text.primary,
  },
}));

type ArticleCardProps = {
  article: ArticleData;
} & React.HTMLAttributes<HTMLElement>;

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
  const { className, article } = props;
  const classes = useStyles();

  return (
    <Card className={className} elevation={2}>
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
      {article.author && (
        <Box p={2} pt={0}>
          <AuthorCard author={article.author} subtitle={article.date}/>
        </Box>
      )}
    </Card>
  );
};

export default ArticleCard;

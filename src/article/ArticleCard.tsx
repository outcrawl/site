import { Box, Card, CardContent, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import AuthorCard from '../author/AuthorCard';
import { ArticleData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
  },
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
    <Card className={classNames(className, classes.root)} elevation={2}>
      {article.cover && (
        <Link to={`/${article.slug}/`}>
          <Img fluid={article.cover}/>
        </Link>
      )}
      <CardContent className={classes.content}>
        <Link to={`/${article.slug}/`} className={classes.titleLink}>
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

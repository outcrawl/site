import React from 'react';
import { ArticleData } from './types';
import { Card, CardContent, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import AuthorCard from '../author/AuthorCard';
import Img from 'gatsby-image';

const useStyles = makeStyles((theme: Theme) => createStyles({
  coverImage: {
    position: 'initial',
  },
  titleLink: {
    color: theme.palette.text.primary,
  },
  footer: {
    padding: theme.spacing(2),
    paddingTop: 0,
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
        <Link to={article.slug}>
          <Img className={classes.coverImage} fluid={article.cover}/>
        </Link>
      )}
      <CardContent>
        <Link to={article.slug} className={classes.titleLink}>
          <Typography variant="h5">
            {article.title}
          </Typography>
        </Link>
      </CardContent>
      <div className={classes.footer}>
        {article.author && <AuthorCard author={article.author} subtitle={article.date}/>}
      </div>
    </Card>
  );
};

export default ArticleCard;

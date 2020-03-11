import React from 'react';
import { ArticleInfo } from './types';
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
  info: ArticleInfo;
}

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
  const { info } = props;
  const classes = useStyles();

  return (
    <Card>
      {info.cover && (
        <Link to={info.slug}>
          <Img className={classes.coverImage} fluid={info.cover}/>
        </Link>
      )}
      <CardContent>
        <Link to={info.slug} className={classes.titleLink}>
          <Typography variant="h5">
            {info.title}
          </Typography>
        </Link>
      </CardContent>
      <div className={classes.footer}>
        {info.author && <AuthorCard author={info.author} subtitle={info.date}/>}
      </div>
    </Card>
  );
};

export default ArticleCard;

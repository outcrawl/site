import * as React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import { ButtonBase, Card, CardContent, createStyles, Grid, Theme, Typography, withStyles } from '@material-ui/core';
import { format as dateFormat } from 'date-fns';

import { Article } from './types';
import AuthorCard from '../author/author-card';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing.unit,
  },
  cover: {
    flexGrow: 1,
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: 200,
    [theme.breakpoints.up('lg')]: {
      height: 250,
    },
    [theme.breakpoints.up('xl')]: {
      height: 300,
    },
  },
  header: {
    paddingTop: 0,
  },
  titleLink: {
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  author: {
    padding: theme.spacing.unit * 3,
    paddingTop: 0,
  },
});

interface ArticleCardProps {
  article: Article;
  classes?: {
    root: string;
    cover: string;
    coverImage: string;
    header: string;
    titleLink: string;
    author: string;
  };
  key: any;
}

class ArticleCard extends React.PureComponent<ArticleCardProps> {
  public render() {
    const { classes, article } = this.props;

    const ArticleLink: React.SFC<any> = props => <Link to={article.slug} {...props} />;

    return (
      <Grid item xs={12} sm={6} className={classes.root}>
        <Card>
          <ButtonBase
            focusRipple
            className={classes.cover}
            component={ArticleLink}>
            <Img fluid={article.cover} style={{ position: 'initial' }}/>
          </ButtonBase>
          <CardContent>
            <Link to={article.slug} className={classes.titleLink}>
              <Typography variant="h5">
                {article.title}
              </Typography>
            </Link>
          </CardContent>
          <AuthorCard author={article.author} className={classes.author}
                      subtitle={dateFormat(article.date, 'DD MMMM, YYYY')}/>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(ArticleCard);

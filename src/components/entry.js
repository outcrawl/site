import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import List, { ListItem, ListItemText } from '@material-ui/core/List';

import { AuthorPlate } from './author';

const styles = (theme) => ({
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

const ArticleLink = ({ to, ...rest }) => <Link to={to} {...rest} />;

const Entry = ({ article, classes }) => (
  <Grid item xs={12} sm={6} className={classes.root}>
    <Card>
      <ButtonBase
        focusRipple
        alt={article.title}
        component={ArticleLink}
        to={`/${article.slug}`}
        className={classes.cover}
        style={{ backgroundImage: `url(${article.coverUrl})` }}
      />
      <CardContent>
        <Link to={`/${article.slug}`} className={classes.titleLink}>
          <Typography variant="headline" component="h2">
            {article.title}
          </Typography>
        </Link>
      </CardContent>
      <AuthorPlate
        className={classes.author}
        author={article.author}
        subtitle={article.date}
      />
    </Card>
  </Grid>
);

export default withStyles(styles)(Entry);

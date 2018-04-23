import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Card, { CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import ButtonBase from 'material-ui/ButtonBase';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';

import AuthorSubtitle from './author-subtitle';

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
      <AuthorSubtitle
        className={classes.author}
        author={article.author}
        subtitle={article.date}
      />
    </Card>
  </Grid>
);

export default withStyles(styles)(Entry);

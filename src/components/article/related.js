import React from 'react';
import Link from 'gatsby-link';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    padding: [[theme.spacing.unit * 3, 0]],
  },
  links: {
    textAlign: 'center',
    listStyle: 'none',
    padding: 0,
  },
  link: {
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  articleTitle: {
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
    marginBottom: '1rem',
  },
});

const ArticleRelated = ({ related, classes }) => (
  <Grid className={classes.root} item xs={12} component="section">
    <h2>Related</h2>
    <ul className={classes.links}>
      {related.map((a) => (
        <li key={a.slug}>
          <Link to={`/${a.slug}`} className={classes.link}>
            <h3 className={classes.articleTitle}>{a.title}</h3>
          </Link>
        </li>
      ))}
    </ul>
  </Grid>
);

export default withStyles(styles)(ArticleRelated);

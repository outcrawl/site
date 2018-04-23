import React from 'react';
import Link from 'gatsby-link';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui';

const styles = (theme) => ({
  root: {
    padding: [[theme.spacing.unit * 3, 0]],
  },
  title: {
    fontSize: '3.5rem',
    marginBottom: '0.4em',
  },
  links: {
    textAlign: 'center',
    listStyle: 'none',
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
});

const ArticleRelated = ({ related, classes }) => (
  <Grid className={classes.root} item xs={12} component="section">
    <Typography variant="display4" className={classes.title} component="h2">
      Related
    </Typography>
    <ul className={classes.links}>
      {related.map((a) => (
        <li key={a.slug}>
          <Link to={`/${a.slug}`} className={classes.link}>
            <Typography variant="headline" component="h3">
              {a.title}
            </Typography>
          </Link>
        </li>
      ))}
    </ul>
  </Grid>
);

export default withStyles(styles)(ArticleRelated);

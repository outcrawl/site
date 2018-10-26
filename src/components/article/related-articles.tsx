import * as React from 'react';
import { createStyles, Grid, Theme, withStyles } from '@material-ui/core';
import { Article } from './types';
import { Link } from 'gatsby';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: 0,
    paddingRight: 0,
  },
  list: {
    textAlign: 'center',
    listStyle: 'none',
    padding: 0,
  },
  link: {
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  title: {
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
    marginBottom: '1rem',
  },
});

interface RelatedArticlesProps {
  related: Article[],
  classes?: {
    root: string;
    list: string;
    link: string;
    title: string;
  };
}

class RelatedArticles extends React.PureComponent<RelatedArticlesProps> {
  public render() {
    const { related, classes } = this.props;

    return (
      <Grid className={classes.root} item xs={12} component="section">
        <h2>Related</h2>
        <ul className={classes.list}>
          {related.map((a, i) => (
            <li key={i}>
              <Link to={`/${a.slug}`} className={classes.link}>
                <h3 className={classes.title}>{a.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    );
  }
}

export default withStyles(styles)(RelatedArticles);

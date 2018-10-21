import * as React from 'react';
import { createStyles, Grid, Theme, Typography, withStyles } from '@material-ui/core';
import { StaticQuery, graphql, Link } from 'gatsby';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: theme.spacing.unit * 110,
    margin: 'auto',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px`,
    },
  },
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  copyright: {
    marginTop: theme.spacing.unit,
    color: theme.palette.text.secondary,
  },
});

interface FooterProps {
  classes?: {
    root: string;
    list: string;
    listItem: string;
    copyright: string;
  };
}

class Footer extends React.PureComponent<FooterProps> {
  public render() {
    const { classes } = this.props;

    return <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={({ site: { siteMetadata: meta } }: any) => (
        <footer className={classes.root}>
          <Typography variant="h6" gutterBottom>
            {meta.title}
          </Typography>
          <Typography variant="body1" component="div">
            <Grid container>
              <Grid item xs={12} sm={6}>
                <ul className={classes.list}>
                  <li className={classes.listItem}>
                    <a href="#">GitHub</a>
                  </li>
                  <li className={classes.listItem}>
                    <a href="#">Twitter</a>
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ul className={classes.list}>
                  <li className={classes.listItem}>
                    <Link to="/about">About</Link>
                  </li>
                  <li className={classes.listItem}>
                    <Link to="/privacy">Privacy</Link>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="body1" className={classes.copyright}>
            2018 &copy; {meta.title}. All rights reserved.
          </Typography>
        </footer>
      )}/>;
  }
}

export default withStyles(styles)(Footer);

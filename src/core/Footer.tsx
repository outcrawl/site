import { Container, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { graphql, Link, StaticQuery } from 'gatsby';
import React from 'react';
import { SiteMetadata } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  content: {
    maxWidth: 768,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    '& a': {
      color: theme.palette.text.primary,
    },
  },
  copyright: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <StaticQuery
      query={graphql`
            {
              site {
                siteMetadata {
                  title
                  copyright
                }
              }
            }
          `}
      render={({ site: { siteMetadata: meta } }: { site: { siteMetadata: SiteMetadata } }): React.ReactNode => (
        <Container component="footer" className={classes.content}>
          <Typography variant="h6" gutterBottom>
            {meta.title}
          </Typography>
          <Typography variant="body1" component="div">
            <Grid container>
              <Grid item xs={12} sm={6}>
                <ul className={classes.list}>
                  <li className={classes.listItem}>
                    <a href="https://github.com/tinrab"
                       target="_blank"
                       rel="noopener noreferrer">GitHub</a>
                  </li>
                  <li className={classes.listItem}>
                    <a href="https://twitter.com/tinrab"
                       target="_blank"
                       rel="noopener noreferrer">Twitter</a>
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ul className={classes.list}>
                  <li className={classes.listItem}>
                    <Link to="/about/">About</Link>
                  </li>
                  <li className={classes.listItem}>
                    <Link to="/privacy/">Privacy</Link>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="body1" className={classes.copyright}>
            {meta.copyright}
          </Typography>
        </Container>
      )}
    />
  );
};

export default Footer;

import * as React from 'react';
import classNames from 'classnames';
import { createStyles, Grid, Theme, withStyles } from '@material-ui/core';

import Layout from './layout';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: 1024,
    margin: '0px auto',
    padding: theme.spacing.unit,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing.unit * 2,
    },
  },
  narrow: {
    maxWidth: 768,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
});

interface PageProps {
  classes?: {
    root: string;
    narrow: string;
  };
  children?: any;
  narrow?: boolean;
}

class Page extends React.PureComponent<PageProps> {
  public render() {
    const { classes, children, narrow } = this.props;

    return (
      <Layout>
        <Grid
          container
          spacing={0}
          className={classNames(classes.root, { [classes.narrow]: narrow })}>
          {children}
        </Grid>
      </Layout>
    );
  }
}

export default withStyles(styles)(Page);

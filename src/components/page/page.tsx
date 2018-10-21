import * as React from 'react';
import { Grid } from '@material-ui/core';

interface PageProps {
  children: any;
}

export class Page extends React.PureComponent<PageProps, {}> {
  public render() {
    const { children } = this.props;

    return (
      <Grid container spacing={0}>
        {children}
      </Grid>
    );
  }
}

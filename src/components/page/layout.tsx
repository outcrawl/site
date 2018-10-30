import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core';

import globalStyles from './global-styles';
import Header from './header';
import Footer from './footer';

const styles = (theme: Theme) => createStyles({
  '@global': globalStyles(theme),
});

interface LayoutProps {
  children: any;
}

class Layout extends React.PureComponent<LayoutProps> {
  public render() {
    const { children } = this.props;

    return (
      <main>
        <Header/>
        {children}
        <Footer/>
      </main>
    );
  }
}

export default withStyles(styles)(Layout);

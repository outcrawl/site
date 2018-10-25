import * as React from 'react';
import { createMuiTheme, createStyles, MuiThemeProvider, Theme, withStyles } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';

import globalStyles from './global-styles';
import Header from './header';
import Footer from './footer';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    htmlFontSize: 16,
  },
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: blue[500],
    },
  },
});

const styles = (theme: Theme) => createStyles({
  '@global': globalStyles(theme),
  main: {
    backgroundColor: theme.palette.background.paper,
  },
});

interface LayoutProps {
  children: any;
  classes?: {
    main: string;
  };
}

class Layout extends React.PureComponent<LayoutProps> {
  public render() {
    const { children, classes } = this.props;

    return (
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <main>
          <Header/>
          <main className={classes.main}>
            {children}
          </main>
          <Footer/>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Layout);

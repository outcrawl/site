import * as React from 'react';
import { createStyles, MuiThemeProvider, Theme, withStyles } from '@material-ui/core';
import JssProvider from 'react-jss/lib/JssProvider';

import globalStyles from './global-styles';
import Header from './header';
import Footer from './footer';

import { theme, getPageContext } from '../../utils/page-context';

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
  private muiPageContext: any;

  constructor(props: LayoutProps) {
    super(props);

    this.muiPageContext = getPageContext();
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render() {
    const { children, classes } = this.props;

    return (
      <JssProvider generateClassName={this.muiPageContext.generateClassName}>
        <MuiThemeProvider theme={theme}
                          sheetsManager={this.muiPageContext.sheetsManager}>
          <Header/>
          <main className={classes.main}>
            {children}
          </main>
          <Footer/>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

export default withStyles(styles)(Layout);

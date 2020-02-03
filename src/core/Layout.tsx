import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from './theme';
import Header from './Header';

type LayoutProps = {
  children: React.ReactNode,
}

const Layout: React.FC<LayoutProps> = ({children}: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Header/>
    {children}
  </ThemeProvider>
);

export default Layout;

import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from './theme';
import Header from './Header';
import Footer from './Footer';
import { makeStyles } from '@material-ui/core/styles';
import './code-theme.scss';

const useStyles = makeStyles({
  '@global': {
    a: {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  content: {
    backgroundColor: theme.palette.common.white,
  },
});

type LayoutProps = {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header/>
      <main className={classes.content}>
        {children}
      </main>
      <Footer/>
    </ThemeProvider>
  );
};

export default Layout;

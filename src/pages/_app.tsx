import { globalStyles, theme } from '../theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'whatwg-fetch';

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <CssBaseline />
    <GlobalStyles styles={globalStyles} />
    <Component {...pageProps} />
  </ThemeProvider>
);

export default CustomApp;

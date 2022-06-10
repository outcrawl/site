import { globalStyles, theme } from '../theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { AppProps } from 'next/app';
import React from 'react';
import 'whatwg-fetch';

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles styles={globalStyles} />
    <Component {...pageProps} />
  </ThemeProvider>
);

export default CustomApp;

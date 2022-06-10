import Footer from '../footer/Footer';
import Header from '../header/Header';
import CookieConsent from './CookieConsent';
import { Container } from '@mui/material';
import React, { ReactNode } from 'react';

type PageProps = {
  narrow?: boolean;
  children?: ReactNode;
};

const Page: React.FC<PageProps> = ({ narrow, children }: PageProps) => (
  <>
    <Header />
    <Container
      sx={{ flexGrow: 1, my: 3 }}
      component="main"
      maxWidth={narrow ? 'md' : 'lg'}
    >
      {children}
    </Container>
    <Footer />
    <CookieConsent />
  </>
);

export default Page;

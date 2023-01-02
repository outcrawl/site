import { Alert, Container } from '@mui/material';
import React, { ReactNode } from 'react';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import CookieConsent from './CookieConsent';
import ExternalLink from './ExternalLink';

type PageProps = {
  narrow?: boolean;
  children?: ReactNode;
};

const Page: React.FC<PageProps> = ({ narrow, children }: PageProps) => (
  <>
    <Header />
    <Alert severity="warning" sx={{ m: 2 }}>
      This website is deprecated. Go to <ExternalLink href="https://flinect.com">flinect.com</ExternalLink>!
    </Alert>
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

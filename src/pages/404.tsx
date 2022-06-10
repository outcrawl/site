import InternalLink from '../common/InternalLink';
import Page from '../common/Page';
import { routerRedirects } from '../routes';
import { Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

const Page404Route: NextPage = () => (
  <Page narrow>
    <Typography component="p" gutterBottom variant="body1">
      The page you are looking for has been removed or relocated.
    </Typography>
    <Typography component="p" gutterBottom variant="body1">
      <InternalLink href={routerRedirects.home.index}>
        Return to Outcrawl.
      </InternalLink>
    </Typography>
  </Page>
);

export default Page404Route;

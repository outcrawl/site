import React from 'react';

import { Page, PageSection } from '../components/page';

const NotFoundPage = () => (
  <Page narrow>
    <PageSection component="article">
      <h1>Page Not Found</h1>
      <p>Maybe "crawl" somewhere else.</p>
    </PageSection>
  </Page>
);

export default NotFoundPage;

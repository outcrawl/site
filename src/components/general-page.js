import React from 'react';

import { Page, PageSection } from './page';

const GeneralPage = ({ page }) => (
  <Page narrow>
    <PageSection
      component="article"
      dangerouslySetInnerHTML={{ __html: page.html }}
    />
  </Page>
);

export default GeneralPage;

import React from 'react';
import { withStyles } from 'material-ui';

import { Page, PageSection } from './page';

const GeneralPage = ({ page }) => (
  <Page narrow>
    <PageSection component="article">
      <h1>{page.title}</h1>
      <span dangerouslySetInnerHTML={{ __html: page.html }} />
    </PageSection>
  </Page>
);

export default GeneralPage;

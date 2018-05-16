import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { Page, PageSection } from '../components/page';

const ElementsPage = () => (
  <Page narrow>
    <PageSection component="article">
      <h2>Buttons</h2>
      <Button variant="raised">Default</Button>
      <Button variant="raised" color="primary">
        Primary
      </Button>
      <Button variant="raised" color="secondary">
        Secondary
      </Button>
      <Button variant="raised" color="secondary" disabled>
        Disabled
      </Button>
    </PageSection>
  </Page>
);

export default ElementsPage;

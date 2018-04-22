import React from 'react';
import { withStyles } from 'material-ui';
import Button from 'material-ui/Button';

import markdownStyles from '../utils/markdown-styles';
import { Page, PageSection } from '../components/page';

const styles = (theme) => ({
  article: markdownStyles(theme),
});

const ElementsPage = ({ classes }) => (
  <Page narrow>
    <PageSection component="article" className={classes.article}>
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

export default withStyles(styles)(ElementsPage);

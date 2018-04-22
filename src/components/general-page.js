import React from 'react';
import { withStyles } from 'material-ui';

import markdownStyles from '../utils/markdown-styles';
import { Page, PageSection } from './page';

const styles = (theme) => ({
  page: markdownStyles(theme),
});

const GeneralPage = ({ page, classes }) => (
  <Page narrow>
    <PageSection component="article" className={classes.page}>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </PageSection>
  </Page>
);

export default withStyles(styles)(GeneralPage);

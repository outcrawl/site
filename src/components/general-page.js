import React from 'react';
import { withStyles } from 'material-ui';

import { PageMeta } from './meta';
import { Page, PageSection } from './page';

const GeneralPage = ({ page }) => (
  <Page narrow>
    <PageMeta page={page} />

    <PageSection component="article">
      <h1>{page.title}</h1>
      <span dangerouslySetInnerHTML={{ __html: page.html }} />
    </PageSection>
  </Page>
);

export default GeneralPage;
/*
title={`${page.title} - ${meta.site.title}`}
      description={page.description}
      url={`${meta.site.siteUrl}/${page.slug}`}

*/

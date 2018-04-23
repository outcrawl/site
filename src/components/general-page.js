import React from 'react';
import { withStyles } from 'material-ui';

import { SiteMeta, PageMeta } from './meta';
import { Page, PageSection } from './page';

const GeneralPage = ({ meta, page }) => (
  <Page narrow>
    <SiteMeta meta={meta} />
    <PageMeta
      meta={meta}
      title={`${page.title} - ${meta.site.title}`}
      description={page.description}
      url={`${meta.site.siteUrl}/${page.slug}`}
    />

    <PageSection component="article">
      <h1>{page.title}</h1>
      <span dangerouslySetInnerHTML={{ __html: page.html }} />
    </PageSection>
  </Page>
);

export default GeneralPage;

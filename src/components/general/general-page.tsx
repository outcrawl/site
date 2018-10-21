import * as React from 'react';

import { Page, PageSection } from '../page';

interface GeneralPageProps {
  title: string;
  html: string;
}

class GeneralPage extends React.PureComponent<GeneralPageProps> {
  public render() {
    const { title, html } = this.props;

    return (
      <Page narrow>
        <PageSection component="article">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }}/>
        </PageSection>
      </Page>
    );
  }
}

export default GeneralPage;

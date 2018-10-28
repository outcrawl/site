import * as React from 'react';

import { Page, PageSection } from '../page';
import { GeneralInfo } from './types';
import GeneralMeta from './general-meta';

interface GeneralPageProps {
  info: GeneralInfo;
  title: string;
  html: string;
}

class GeneralPage extends React.PureComponent<GeneralPageProps> {
  public render() {
    const { info, title, html } = this.props;

    return (
      <Page narrow>
        <GeneralMeta info={info}/>

        <PageSection component="article">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }}/>
        </PageSection>
      </Page>
    );
  }
}

export default GeneralPage;

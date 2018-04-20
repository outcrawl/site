import React from 'react';

import {Page} from './page';
import renderHtml from '../utils/render-html';

const GeneralPage = ({ page }) => (
  <Page narrow component="article">
    {renderHtml(page.ast)}
  </Page>
);

export default GeneralPage;

import * as React from 'react';
import { graphql } from 'gatsby';

import { GeneralPage } from '../components/general';

interface GeneralTemplateProps {
  data: any;
}

class GeneralTemplate extends React.PureComponent<GeneralTemplateProps> {
  public render() {
    const page = this.props.data.markdownRemark;

    return <GeneralPage title={page.fields.title} html={page.html}/>;
  }
}

export default GeneralTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      fields {
        title
        slug
        description
      }
    }
  }
`;

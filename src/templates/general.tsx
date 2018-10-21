import * as React from 'react';

interface GeneralTemplateProps {
  pathContext: {
    slug: string;
  };
}

class GeneralTemplate extends React.PureComponent<GeneralTemplateProps, {}> {
  public render() {
    const data = this.props.pathContext;

    return (
      <div>General page {data.slug}</div>
    );
  }
}

export default GeneralTemplate;

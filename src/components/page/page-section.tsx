import * as React from 'react';
import { Grid } from '@material-ui/core';

interface PageSectionProps {
  children: any;
  component?: any;
  className?: string;
}

class PageSection extends React.PureComponent<PageSectionProps> {
  public render() {
    const {
      children,
      component,
      className,
    } = this.props;

    return (
      <Grid item xs={12} component={component} className={className}>
        {children}
      </Grid>
    );
  }
}

export default PageSection;

import React from 'react';
import Grid from 'material-ui/Grid';

const PageSection = props => (
  <Grid component={props.component} className={props.className}
    item
    xs={12}
    dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}>
    {props.children}
  </Grid>
);

export default PageSection;

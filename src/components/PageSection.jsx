import React from 'react';
import Grid from 'material-ui/Grid';

const PageSection = props => (
  <Grid component={props.component} className={props.className}
    item
    xs={12}
    sm={props.half ? 6 : 12}
    dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}>
    {props.children}
  </Grid>
);


export default PageSection;

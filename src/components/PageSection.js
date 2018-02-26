import React from 'react';
import Grid from 'material-ui/Grid';

export default props => (
  <Grid item xs={12}
    component={props.component}
    className={props.className}
    dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}>
    {props.children}
  </Grid>
);

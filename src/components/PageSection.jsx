import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    '& h1': {
      fontSize: '3.75rem',
      fontWeight: 300,
      letterSpacing: '-0.02em',
      lineHeight: 1.35,
      margin: [0, 0, '2rem']
    }
  }
});

const PageSection = props => {
  const classes = props.classes;
  return (
    <Grid component={props.component} className={classes.root}
      item
      xs={12}
      sm={props.half ? 6 : 12}
      dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}>
      {props.children}
    </Grid>
  );
};

export default withStyles(styles)(PageSection);

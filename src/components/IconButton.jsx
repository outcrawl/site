import React from 'react';
import { withStyles } from 'material-ui/styles';
import MaterialIconButton from 'material-ui/IconButton';

const styles = theme => ({
  root: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '24px',
    verticalAlign: 'middle',
    textDecoration: 'none'
  }
});

const IconButton = props => (
  <MaterialIconButton
    className={`${props.classes.root}`}
    onClick={props.onClick}
    {...props}>
    {props.children}
  </MaterialIconButton>
);

export default withStyles(styles)(IconButton);

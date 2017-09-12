import React from 'react';
import { withStyles } from 'material-ui/styles';
import MaterialButton from 'material-ui/Button';

const styles = theme => ({
  primary: {
    backgroundColor: theme.palette.primary[900],
    color: '#fff'
  }
});

const Button = props => (
  <MaterialButton
    className={props.primary ? props.classes.primary : ''}
    color={props.primary ? 'primary' : 'default'}
    raised={props.raised}
    onClick={props.onClick}>
    {props.children}
  </MaterialButton>
);

export default withStyles(styles)(Button);

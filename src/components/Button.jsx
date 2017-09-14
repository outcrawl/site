import React from 'react';
import { withStyles } from 'material-ui/styles';
import MaterialButton from 'material-ui/Button';

const styles = theme => ({
  primary: {
    backgroundColor: theme.palette.primary[900],
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary[700]
    }
  }
});

const Button = props => (
  <MaterialButton
    className={`${props.primary ? props.classes.primary : ''} ${props.className}`}
    color={props.primary ? 'primary' : 'default'}
    raised={props.raised}
    dense={props.dense}
    onClick={props.onClick}>
    {props.children}
  </MaterialButton>
);

export default withStyles(styles)(Button);

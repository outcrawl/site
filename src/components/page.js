import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import classNames from 'classnames';

const styles = (theme) => ({
  root: {
    maxWidth: 1024,
    margin: [[0, 'auto']],
    padding: theme.spacing.unit,
  },
  narrow: {
    maxWidth: 720,
    padding: [[theme.spacing.unit * 4, theme.spacing.unit]],
  },
  // Shortcodes
  '.page__note': {
    lineHeight: 1.6,
    padding: 16,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
  },
});

const Page = withStyles(styles)(({ classes, children, narrow }) => {
  return (
    <Grid
      container
      spacing={0}
      className={classNames(classes.root, { [classes.narrow]: narrow })}
    >
      {children}
    </Grid>
  );
});

const PageSection = withStyles(styles)(({ className, component, children }) => {
  return (
    <Grid className={className} item xs={12} component={component}>
      {children}
    </Grid>
  );
});

export default {
  Page,
  PageSection,
};

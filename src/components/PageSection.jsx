import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = theme => {
  return ({
    root: {
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      ['-ms-word-break']: 'break-all',
      wordBreak: 'break-word',
      ['-ms-hyphens']: 'auto',
      ['-moz-hyphens']: 'auto',
      ['-webkit-hyphens']: 'auto',
      hyphens: 'auto',
      lineHeight: 1.35,
      '& h1': {
        fontSize: '3.75rem',
        fontWeight: 300,
        letterSpacing: '-.04em',
        margin: [0, 0, '1.5rem', 0]
      },
      '& h2': {
        fontSize: '2.75rem',
        fontWeight: 500,
        margin: ['2rem', 0, '1.5rem', 0]
      },
      '& h3': {
        fontSize: '2rem',
        fontWeight: 500,
        margin: ['1.5rem', 0, '1rem', 0]
      },
      '& h4': {
        fontSize: '1.25rem',
        fontWeight: 500,
        margin: ['1.5rem', 0, '1rem', 0]
      },
      '& p': {
        lineHeight: 1.25,
        margin: [0, 0, '1rem', 0]
      },
      '& .gatsby-highlight, & blockquote': {
        margin: [0, 0, '1rem', 0]
      }
    }
  });
};

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

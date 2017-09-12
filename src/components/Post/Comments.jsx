import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import backend from '../../utils/backend.js';

const styles = theme => ({
  root: {
    padding: [48, 0]
  }
});

class Comments extends React.Component {
  constructor(props) {
    super();
    this.threadId = props.threadId;
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <h1>
          Comments
        </h1>
      </div>
    );
  }
}

export default withStyles(styles)(Comments);

import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';

import backend from '../../utils/backend.js';
import Comment from './Comment';

const styles = theme => ({
  root: {
    padding: [48, 0]
  },
  progress: {
    display: 'block',
    margin: [0, 'auto']
  }
});

class Comments extends React.Component {
  state = {
    thread: null,
    error: null
  };

  constructor(props) {
    super();
    this.threadId = props.threadId;

    backend.getThread(this.threadId)
      .then(thread => this.setState({ thread: thread }))
      .catch(error => this.setState({ error: error }));
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <h1>
          Comments
        </h1>
        {this.state.thread ?
          <div>
            {this.state.thread.comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
          : <CircularProgress className={classes.progress} />}
      </div>
    );
  }
}

export default withStyles(styles)(Comments);

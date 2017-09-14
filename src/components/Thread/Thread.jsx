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
import Button from '../Button';
import Comment from './Comment';
import Form from './Form';

const styles = theme => ({
  root: {
    padding: [48, 0]
  },
  progress: {
    display: 'block',
    margin: [0, 'auto']
  }
});

class Thread extends React.Component {
  state = {
    thread: null,
    user: null,
    error: null,
    dialog: {
      open: false,
      message: '',
      title: ''
    }
  };

  componentDidMount() {
    this.threadId = this.props.threadId;
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
        <Form
          user={this.state.user}
          onSignInClick={this.handleSignIn}
          onSignOutClick={this.handleSignOut}
          onPostComment={this.handlePostComment} />
        {this.state.thread ?
          <div>
            {this.state.thread.comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
          : <CircularProgress className={classes.progress} />}

        <Dialog open={this.state.dialog.open} onRequestClose={this.closeDialog}>
          {this.state.title ? <DialogTitle>{this.state.title}</DialogTitle> : null}
          {this.state.message ? <DialogContent>
            <DialogContentText>{this.state.message}</DialogContentText>
          </DialogContent> : null}
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }

  handleSignIn = () => {
    backend.signIn()
      .then(_ => this.setState({ user: backend.user }))
      .catch(error => {
        if (error.error != 'popup_closed_by_user') {
          this.showDialog('Oh no!', 'You were unable to sign in.');
        }
      });
  };

  handleSignOut = () => {
    backend.signOut();
    this.setState({ user: null });
  }

  handlePostComment = text => {
    text = text.trim();
    if (!backend.user || text.length == 0) {
      return;
    }

    backend.createComment(this.threadId, text)
      .then(comment => {
        comment.createdAt = new Date(comment.createdAt);
        comment.replies = [];
        comment.user = {
          displayName: backend.user.displayName,
          imageUrl: backend.user.imageUrl
        };

        const thread = this.state.thread;
        thread.comments.unshift(comment);

        this.setState({ thread: thread });
      })
      .catch(error => this.showDialog('Oh no!', 'Something went wrong.'));
  }

  closeDialog = () => {
    this.setState({ dialog: { open: false } });
  }

  showDialog = (title, message) => {
    this.setState({
      dialog: {
        open: true,
        message: message,
        title: title
      }
    });
  }
}

export default withStyles(styles)(Thread);

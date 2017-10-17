import React from 'react';
import Link from 'gatsby-link';

import withStyles from '../ui/withStyles';
import Snackbar from '../ui/Snackbar';
import { CircularProgress } from '../ui/Progress';
import Button from '../ui/Button';
import backend from '../../utils/backend.js';
import threadBuilder from '../../utils/thread-builder.js';
import Comment from './Comment';
import Form from './Form';

const styles = theme => ({
  root: {
    padding: [16, 0],
    [theme.breakpoints.up('sm')]: {
      padding: [48, 0, 24, 0]
    }
  },
  progress: {
    display: 'block',
    margin: [0, 'auto']
  },
  comments: {
    marginTop: 24
  }
});

class Thread extends React.Component {
  state = {
    thread: null,
    user: null,
    snackbar: {
      open: false,
      message: ''
    }
  };

  componentDidMount() {
    this.threadId = this.props.threadId;
    backend.addOnInitListener(user => this.setState({ user: user }));
    backend.getThread(this.threadId)
      .then(thread => this.setState({ thread: thread }))
      .catch(error => console.error(error));
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
          postComment={this.postComment} />
        {this.state.thread ?
          <div className={classes.comments}>
            {this.state.thread.comments.map((comment, i) => (
              <Comment key={i}
                comment={comment}
                postReply={this.postReply}
                deleteComment={this.deleteComment}>
                {comment.replies.map((reply, j) => <Comment key={j} reply
                  comment={reply}
                  postReply={this.postReply}
                  deleteComment={this.deleteComment} />)}
              </Comment>
            ))}
          </div>
          : <CircularProgress className={classes.progress} />}

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          onRequestClose={this.handleSnackbarClose}
        />

      </div>
    );
  }

  handleSignIn = () => {
    backend.signIn()
      .then(_ => {
        this.setState({ user: backend.user });
        if (typeof ga !== 'undefined') {
          ga('send', 'event', 'Comments', 'signIn');
        }
      })
      .catch(error => {
        if (error.error != 'popup_closed_by_user') {
          this.showSnackbar('You were unable to sign in.');
        }
      });
  };

  handleSignOut = () => {
    backend.signOut();
    this.setState({ user: null });
  }

  postComment = text => {
    text = text.trim();
    if (!backend.user || text.length == 0) {
      return;
    }

    return new Promise((resolve, reject) => {
      backend.createComment(this.threadId, text)
        .then(comment => {
          comment.createdAt = new Date(comment.createdAt);
          comment.replies = [];
          comment.html = threadBuilder.parseContent(comment.text);
          comment.user = {
            displayName: backend.user.displayName,
            imageUrl: backend.user.imageUrl
          };

          const thread = this.state.thread;
          thread.comments.unshift(comment);

          this.setState({ thread: thread });
          if (ga) {
            ga('send', 'event', 'Newsletter', 'createComment');
          }
          resolve();
        })
        .catch(error => {
          this.showSnackbar('Something went wrong.');
          reject(error);
        });
    });
  }

  postReply = (commentId, text) => {
    text = text.trim();
    if (!backend.user || text.length == 0) {
      return;
    }

    return new Promise((resolve, reject) => {
      backend.createComment(this.threadId, text, commentId)
        .then(comment => {
          comment.createdAt = new Date(comment.createdAt);
          comment.html = threadBuilder.parseContent(comment.text);
          comment.user = {
            displayName: backend.user.displayName,
            imageUrl: backend.user.imageUrl
          };

          // Find original comment
          const thread = this.state.thread;
          let parent = thread.comments.find(c => c.id == commentId);
          if (!parent) {
            for (const c of thread.comments) {
              if (c.replies) {
                parent = c.replies.find(r => r.id == commentId);
                if (parent) {
                  break;
                }
              }
            }
          }
          comment.replyToName = parent.user.displayName;

          // Update parent
          if (parent.replyTo) {
            parent = thread.comments.find(c => c.replies && c.replies.find(r => r.id = parent.id) != null);
          }
          parent.replies.push(comment);

          // Update state
          this.setState({ thread: thread });
          ga('send', 'event', 'Newsletter', 'createComment');
          resolve();
        })
        .catch(error => {
          this.showSnackbar('Something went wrong.');
          reject(error);
        });
    });
  }

  deleteComment = commentId => {
    backend.deleteComment(this.threadId, commentId)
      .then(() => {
        const thread = this.state.thread;
        thread.comments = thread.comments.filter(c => c.id != commentId && c.replyTo != commentId);
        for (const c of thread.comments) {
          c.replies = c.replies.filter(rc => rc.id != commentId && rc.replyTo != commentId);
        }
        this.setState({ thread: thread });
      })
      .catch(() => this.showSnackbar('Could not delete this comment.'));
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbar: {
        open: false,
        message: ''
      }
    });
  }

  showSnackbar = message => {
    this.setState({
      snackbar: {
        open: true,
        message: message
      }
    });
  }
}

export default withStyles(styles)(Thread);

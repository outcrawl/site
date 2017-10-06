import React from 'react';
import timeago from 'timeago.js';

import withStyles from '../ui/withStyles';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import backend from '../../utils/backend.js';

const styles = theme => ({
  root: {
    display: 'flex',
    marginBottom: 16
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%'
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%'
  },
  body: {
    paddingLeft: 16,
    width: '100%'
  },
  head: {
    fontSize: 14
  },
  date: {
    color: theme.palette.text.secondary,
    marginLeft: 6
  },
  userName: {
    fontWeight: 500
  },
  content: {
    fontSize: 16,
    padding: [8, 0]
  },
  actions: {
    marginLeft: -8,
    marginTop: -8
  },
  actionButton: {
    minWidth: 0,
    color: theme.palette.text.secondary
  },
  replies: {
    marginTop: 16
  },
  replyActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 8
  },
  replyActionButton: {
    marginLeft: 8
  }
});

class Comment extends React.Component {
  state = {
    replyFormVisible: false,
    replyText: ''
  };

  constructor(props) {
    super();
    this.commentId = props.comment.id;
  }

  render() {
    const { classes, comment, children } = this.props;

    return (
      <div className={classes.root}>
        <img src={comment.user.imageUrl} className={this.props.reply ? classes.replyAvatar : classes.avatar} />
        <div className={classes.body}>
          <div className={classes.head}>
            <span className={classes.userName}>{comment.user.displayName}</span>
            <span className={classes.date}>{timeago().format(comment.createdAt)}</span>
          </div>
          <div
            className={`${classes.content} markdown`}
            dangerouslySetInnerHTML={{ __html: comment.html }}></div>
          {this.renderActions(comment)}
          {this.state.replyFormVisible ? this.renderReplyForm() : ''}
          {children && children.length != 0 ?
            <div className={classes.replies}>
              {children}
            </div> : ''
          }
        </div>
      </div>
    );
  }

  renderReplyForm = () => {
    const { classes } = this.props;
    return (
      <div>
        <TextField
          multiline
          fullWidth
          rows="4"
          rowsMax="16"
          placeholder="Write a reply"
          onChange={this.handleReplyChange}
          value={this.state.replyText}
          className={classes.replyInput} />
        <div className={classes.replyActions}>
          <Button
            onClick={this.handleCancelReply}
            className={classes.replyActionButton}>Cancel</Button>
          <Button
            onClick={this.handlePostReply}
            color="primary"
            raised
            className={classes.replyActionButton}>Post</Button>
        </div>
      </div>
    );
  };

  renderActions = comment => {
    const { classes } = this.props;
    return (
      backend.user ? (
        backend.user.admin ? (
          <div className={classes.actions}>
            <Button dense
              className={classes.actionButton}
              onClick={this.handleReplyClick}>Reply</Button>
            <Button dense
              className={classes.actionButton}
              onClick={this.handleDelete}>Delete</Button>
          </div>
        ) :
          (
            <div className={classes.actions}>
              <Button dense
                className={classes.actionButton}
                onClick={this.handleReplyClick}>Reply</Button>
            </div>
          )
      ) : null
    );
  };

  handleReplyClick = () => {
    this.setState({ replyFormVisible: true });
  };

  handleReplyChange = event => {
    this.setState({ replyText: event.target.value });
  };

  handlePostReply = () => {
    this.props.postReply(this.commentId, this.state.replyText)
      .then(() => {
        this.setState({
          replyFormVisible: false,
          replyText: ''
        });
      });
  };

  handleDelete = () => {
    this.props.deleteComment(this.commentId);
  };

  handleCancelReply = () => {
    this.setState({ replyFormVisible: false });
  };
}

export default withStyles(styles)(Comment);

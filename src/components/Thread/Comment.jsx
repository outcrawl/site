import React from 'react';
import { withStyles } from 'material-ui/styles';
import timeago from 'timeago.js';

import backend from '../../utils/backend.js';
import Button from '../Button';

const styles = theme => ({
  root: {
    display: 'flex'
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
    paddingLeft: 16
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
  }
});

const Actions = ({ classes, comment }) => (
  <div>
    {backend.user ? (
      backend.user.admin ? (
        <span>
          <Button>Reply</Button>
          <Button>Delete</Button>
          <Button>Ban user</Button>
        </span>
      ) : (
          <Button>Reply</Button>
        )
    ) : ''}
  </div>
);

const Reply = ({ classes, comment }) => (
  <div className={classes.root}>
    <img src={comment.user.imageUrl} className={classes.replyAvatar} />
    <div className={classes.body}>
      <div className={classes.head}>
        <span className={classes.userName}>{comment.user.displayName}</span>
        <span className={classes.date}>{timeago().format(comment.createdAt)}</span>
      </div>
      <div
        className={`${classes.content} markdown`}
        dangerouslySetInnerHTML={{ __html: comment.html }}></div>
      <Actions classes={classes} comment={comment} />
    </div>
  </div>
);

const Comment = ({ classes, comment }) => (
  <div className={classes.root}>
    <img src={comment.user.imageUrl} className={classes.avatar} />
    <div className={classes.body}>
      <div className={classes.head}>
        <span className={classes.userName}>{comment.user.displayName}</span>
        <span className={classes.date}>{timeago().format(comment.createdAt)}</span>
      </div>
      <div
        className={`${classes.content} markdown`}
        dangerouslySetInnerHTML={{ __html: comment.html }}></div>
      <Actions classes={classes} comment={comment} />
      <div>
        {comment.replies.map(reply =>
          <Reply key={reply.id} comment={reply} classes={classes} />
        )}
      </div>
    </div>
  </div>
);

export default withStyles(styles)(Comment);

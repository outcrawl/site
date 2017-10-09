import React from 'react';

import withStyles from '../ui/withStyles';
import Button from '../ui/Button';
import { Tabs, Tab } from '../ui/Tabs';
import TextField from '../ui/TextField';
import threadBuilder from '../../utils/thread-builder.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    fontSize: 16
  },
  tabIndicator: {
    backgroundColor: theme.palette.primary[900]
  },
  tabSelected: {
    color: theme.palette.primary[900]
  },
  auth: {
    display: 'flex',
    alignItems: 'center'
  },
  authButton: {
    marginLeft: 'auto'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 16
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postInfo: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    marginRight: 8
  },
  form: {
    padding: [8, 0]
  },
  commentInput: {
    margin: [8, 0]
  },
  commentPreview: {
    margin: [8, 0]
  }
});

class Form extends React.Component {
  state = {
    tab: 0,
    enteredValue: ''
  };

  render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        {user ?
          <div>
            <div className={classes.auth}>
              <img src={user.imageUrl} className={classes.avatar} />
              <div>{user.displayName}</div>
              <Button
                className={classes.authButton}
                onClick={this.props.onSignOutClick}>
                Sign out
            </Button>
            </div>
            <div className={classes.form}>
              <Tabs
                value={this.state.tab}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                indicatorClassName={classes.tabIndicator}>
                <Tab label="Edit" classes={{ rootPrimarySelected: classes.tabSelected }} />
                <Tab label="Preview" classes={{ rootPrimarySelected: classes.tabSelected }} />
              </Tabs>
              {this.state.tab == 0 ?
                <TextField
                  multiline
                  fullWidth
                  rows="4"
                  rowsMax="16"
                  placeholder="Write a comment"
                  onChange={this.handleChangePost}
                  value={this.state.enteredValue}
                  className={classes.commentInput} />
                :
                <div
                  className={`${classes.commentPreview} markdown`}
                  dangerouslySetInnerHTML={{
                    __html: this.state.enteredValue ?
                      threadBuilder.parseRawContent(this.state.enteredValue.trim()) :
                      'Nothing to preview'
                  }}>
                </div>
              }
              <div className={classes.actions}>
                <div className={classes.postInfo}>Supports GitHub Flavored Markdown.</div>
                <Button color="primary" raised onClick={this.handlePost}>Post</Button>
              </div>
            </div>
          </div>
          :
          <div className={classes.auth}>
            <div>Sign in to post a comment</div>
            <Button
              className={classes.authButton}
              onClick={this.props.onSignInClick}>
              Sign in
            </Button>
          </div>
        }
      </div>
    );
  }

  handleChangePost = event => {
    this.setState({
      enteredValue: event.target.value,
    });
  };

  handlePost = () => {
    this.props.postComment(this.state.enteredValue)
      .then(() => this.setState({ enteredValue: '' }));
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };
}

export default withStyles(styles)(Form);

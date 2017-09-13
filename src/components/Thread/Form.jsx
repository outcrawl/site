import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from '../Button';
import Tabs, { Tab } from 'material-ui/Tabs';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  tabIndicator: {
    backgroundColor: theme.palette.primary[900]
  },
  tabSelected: {
    color: theme.palette.primary[900]
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  authButton: {
    marginLeft: 'auto'
  }
});

class Form extends React.Component {
  state = {
    tab: 0
  };

  render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        {user ?
          <div className={classes.userInfo}>
            {user.displayName}
            <Button
              className={classes.authButton}
              onClick={this.props.onSignOutClick}>
              Sign out
            </Button>
          </div>
          :
          <div className={classes.userInfo}>
            <div>Sign in to post a comment</div>
            <Button
              className={classes.authButton}
              onClick={this.props.onSignInClick}>
              Sign in
            </Button>
          </div>
        }
        <Tabs
          value={this.state.tab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          indicatorClassName={classes.tabIndicator}>
          <Tab label="Edit" classes={{ rootPrimarySelected: classes.tabSelected }} />
          <Tab label="Preview" classes={{ rootPrimarySelected: classes.tabSelected }} />
        </Tabs>
        <div>
          {this.state.tab}
        </div>
      </div>
    );
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };
}

export default withStyles(styles)(Form);

import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import backend from '../../utils/backend.js';

const styles = theme => ({
  root: {
    padding: [48, 0]
  },
  content: {
    textAlign: 'center'
  },
  lead: {
    fontSize: '1.5rem',
    fontWeight: 300,
    marginBottom: '1rem'
  }
});

class Newsletter extends React.Component {
  state = {
    dialogOpen: false,
    message: '',
    title: ''
  };

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <h1>
          Newsletter
        </h1>
        <div className={classes.content}>
          <p className={classes.lead}>
            Get awesome articles delivered right to your doorstep
        </p>
          <Button onClick={this.onSubscribeClick} color="primary" raised>Subscribe</Button>
        </div>

        <Dialog open={this.state.dialogOpen} onRequestClose={this.closeDialog}>
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

  onSubscribeClick = () => {
    backend.subscribe()
      .then(googleUser => {
        this.showDialog(
          'You have subscribed!',
          `See you soon, ${googleUser.getBasicProfile().getGivenName()}!`
        );
      })
      .catch(error => {
        this.showDialog('Something bad happened.', '');
      });
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  showDialog = (title, message) => {
    this.setState({
      dialogOpen: true,
      message: message,
      title: title
    });
  }
}

export default withStyles(styles)(Newsletter);

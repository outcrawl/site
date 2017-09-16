import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
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
    title: '',
    email: ''
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

          <form className={classes.container} autoComplete="on" onSubmit={this.handleSubscribe}>
            <TextField
              required
              type="email"
              name="email"
              value={this.state.value}
              onChange={this.handleChangeEmail}
              placeholder="Email"
              autoComplete="email"
              margin="none" />
            <Button
              type="submit"
              color="primary"
              raised>Subscribe</Button>
          </form>

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

  handleChangeEmail = event => {
    this.setState({ email: event.target.value });
  }

  handleSubscribe = () => {
    const email = this.state.email.trim();
    if (email.length == 0) {
      return;
    }
    backend.subscribe(email)
      .then(() => {
        this.showDialog('You have subscribed!', '');
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

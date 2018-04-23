import React from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';

const backend = {
  apiUrl: 'https://outcrawl-backend.appspot.com/api/v1',

  subscribe: (email, reCaptcha) =>
    new Promise((resolve, reject) => {
      axios
        .post(`${backend.apiUrl}/mail/subscribe`, null, {
          params: {
            email: email,
            recaptcha: reCaptcha,
          },
        })
        .then((_) => resolve())
        .catch(reject);
    }),
};

const styles = (theme) => ({
  root: {
    padding: [[theme.spacing.unit * 3, 0]],
  },
  content: {
    textAlign: 'center',
  },
  lead: {
    fontSize: '1.5rem',
    fontWeight: 300,
    margin: [['1.5rem', 0]],
  },
  captchaNote: {
    fontSize: 13,
    color: theme.palette.text.secondary,
    padding: '8px 0px',
  },
  emailField: {
    verticalAlign: 'middle',
  },
  subscribeButton: {
    marginLeft: 8,
  },
});

class Newsletter extends React.Component {
  state = {
    snackbar: {
      open: false,
      message: '',
    },
    email: '',
  };
  captcha = null;

  render() {
    const classes = this.props.classes;
    return (
      <Grid className={classes.root} item xs={12} component="section">
        <h2>Newsletter</h2>

        <div className={classes.content}>
          <p className={classes.lead}>
            Get awesome articles delivered right to your doorstep
          </p>

          <form
            className={classes.container}
            autoComplete="on"
            onSubmit={this.handleSubscribe}
          >
            <TextField
              className={classes.emailField}
              required
              type="email"
              name="email"
              value={this.state.value}
              onChange={this.handleChangeEmail}
              placeholder="Email"
              autoComplete="email"
              margin="none"
              InputProps={{
                disableUnderline: false,
              }}
            />
            <Button
              className={classes.subscribeButton}
              type="submit"
              color="primary"
              variant="raised"
            >
              Subscribe
            </Button>
            <ReCAPTCHA
              style={{ display: 'none' }}
              ref={(e) => {
                this.captcha = e;
              }}
              size="invisible"
              sitekey="6LcCEDEUAAAAAKvjiu87ZjZn7FZOX4LI-7tKyOLW"
              badge="inline"
              onChange={this.handleReCaptchaChange}
            />
            <div className={classes.captchaNote}>
              Protected by reCAPTCHA -{' '}
              <a href="https://www.google.com/intl/en/policies/privacy/">
                Privacy
              </a>{' '}
              -{' '}
              <a href="https://www.google.com/intl/en/policies/terms/">Terms</a>
            </div>
          </form>
        </div>

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          onClose={this.handleSnackbarClose}
        />
      </Grid>
    );
  }

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleSubscribe = (event) => {
    event.preventDefault();
    this.captcha.execute();
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbar: {
        open: false,
        message: '',
      },
    });
  };

  showSnackbar = (message) => {
    this.setState({
      snackbar: {
        open: true,
        message: message,
      },
    });
  };

  handleReCaptchaChange = (value) => {
    const email = this.state.email.trim();
    if (email.length == 0) {
      return;
    }
    backend
      .subscribe(email, value)
      .then(() => {
        this.showSnackbar('You have subscribed!');
        this.captcha.reset();
        ga('send', 'event', 'Newsletter', 'subscribe');
      })
      .catch((error) => {
        console.error(error);
        this.showSnackbar('Something bad happened.');
        this.captcha.reset();
      });
  };
}

export default withStyles(styles)(Newsletter);

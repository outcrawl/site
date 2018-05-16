import React from 'react';
import Link from 'gatsby-link';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
  form: {
    display: 'inline-block',
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
  privacyNote: {
    fontSize: 16,
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
    agree: false,
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

          <form autoComplete="on" onSubmit={this.handleSubscribe}>
            <FormGroup className={classes.form}>
              <FormGroup row>
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
                  disabled={!this.state.agree}
                >
                  Subscribe
                </Button>
              </FormGroup>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.agree}
                    onChange={this.handleChangeAgree}
                    color="primary"
                  />
                }
                label={
                  <span>
                    I agree to Outcrawl's{' '}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </span>
                }
              />

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
                <a href="https://www.google.com/intl/en/policies/terms/">
                  Terms
                </a>
              </div>
            </FormGroup>
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

  handleChangeAgree = (event) => {
    this.setState({ agree: event.target.checked });
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

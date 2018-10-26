import * as React from 'react';
import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  TextField,
  Theme, withStyles,
} from '@material-ui/core';
import { Link } from 'gatsby';
import ReCAPTCHA from 'react-google-recaptcha';

import NewsletterApi from './newsletter-api';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: 0,
    paddingRight: 0,
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
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    marginLeft: 0,
    marginRight: 0,
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

interface NewsletterProps {
  classes?: {
    root: string;
    content: string;
    form: string;
    lead: string;
    captchaNote: string;
    privacyNote: string;
    emailField: string;
    subscribeButton: string;
  };
}

interface NewsletterState {
  snackbar: {
    open: boolean;
    message: string;
  };
  email: string;
  agree: boolean;
}

const ReCaptcha = (props: any) => (
  <ReCAPTCHA
    {...props}
    size="invisible"
    sitekey="6LcCEDEUAAAAAKvjiu87ZjZn7FZOX4LI-7tKyOLW"
    badge="inline"
  />
);

class Newsletter extends React.Component<NewsletterProps, NewsletterState> {
  private captcha: any;

  constructor(props: NewsletterProps) {
    super(props);

    this.state = {
      snackbar: {
        open: false,
        message: '',
      },
      email: '',
      agree: false,
    };
  }

  private handleChangeEmail = (event: any) => {
    const email = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      email,
    }));
  };

  private handleChangeAgree = (event: any) => {
    const agree = event.target.checked;
    this.setState((prevState) => ({
      ...prevState,
      agree,
    }));
  };

  private handleSubscribe = (event: any) => {
    event.preventDefault();
    this.captcha.execute();
  };

  private handleSnackbarClose = () => {
    this.setState((prevState) => ({
      ...prevState,
      snackbar: {
        open: false,
        message: '',
      },
    }));
  };

  private showSnackbar = (message: string) => {
    this.setState((prevState) => ({
      ...prevState,
      snackbar: {
        open: true,
        message: message,
      },
    }));
  };

  private handleReCaptchaChange = (value: string) => {
    const email = this.state.email.trim();
    if (email.length == 0) {
      return;
    }
    new NewsletterApi()
      .subscribe(email, value)
      .then(() => {
        this.showSnackbar('You have subscribed!');
        this.captcha.reset();
      })
      .catch((error) => {
        console.error(error);
        this.showSnackbar('Something bad happened.');
        this.captcha.reset();
      });
  };

  public render() {
    const { classes } = this.props;

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
                  value={this.state.email}
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
                  variant="contained"
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

              <ReCaptcha
                style={{ display: 'none' }}
                ref={(e: any) => {
                  this.captcha = e;
                }}
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
}

export default withStyles(styles)(Newsletter);

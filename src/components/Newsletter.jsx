import React from 'react';
import Link from 'gatsby-link';
import ReCAPTCHA from 'react-google-recaptcha';

import withStyles from './ui/withStyles';
import TextField from './ui/TextField';
import Snackbar from './ui/Snackbar';
import Button from './ui/Button';
import backend from '../utils/backend.js';

const styles = theme => ({
	root: {
		padding: [16, 0],
		[theme.breakpoints.up('sm')]: {
			padding: [48, 0, 24, 0]
		}
	},
	content: {
		textAlign: 'center'
	},
	lead: {
		fontSize: '1.5rem',
		fontWeight: 300,
		marginBottom: '1rem'
	},
	captchaNote: {
		fontSize: 13,
		color: theme.palette.text.secondary,
		padding: [8, 0]
	},
	emailField: {
		verticalAlign: 'middle'
	},
	subscribeButton: {
		marginLeft: 8
	}
});

class Newsletter extends React.Component {
	state = {
		snackbar: {
			open: false,
			message: ''
		},
		email: ''
	};
	captcha = null;

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
								disableUnderline: false
							}} />
						<Button
							className={classes.subscribeButton}
							type="submit"
							color="primary"
							raised>Subscribe</Button>
						<ReCAPTCHA
							style={{ display: 'none' }}
							ref={e => { this.captcha = e; }}
							size="invisible"
							sitekey="6LcCEDEUAAAAAKvjiu87ZjZn7FZOX4LI-7tKyOLW"
							badge="inline"
							onChange={this.handleReCaptchaChange} />
						<div className={classes.captchaNote}>
							Protected by reCAPTCHA - <a href="https://www.google.com/intl/en/policies/privacy/">Privacy</a> - <a href="https://www.google.com/intl/en/policies/terms/">Terms</a>
						</div>
					</form>

				</div>

				<Snackbar
					open={this.state.snackbar.open}
					message={this.state.snackbar.message}
					onRequestClose={this.handleSnackbarClose}
				/>

			</div>
		);
	}

	handleChangeEmail = event => {
		this.setState({ email: event.target.value });
	}

	handleSubscribe = event => {
		event.preventDefault();
		this.captcha.execute();
	}

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

	handleReCaptchaChange = value => {
		const email = this.state.email.trim();
		if (email.length == 0) {
			return;
		}
		backend.subscribe(email, value)
			.then(() => {
				this.showSnackbar('You have subscribed!');
				this.captcha.reset();
				ga('send', 'event', 'Newsletter', 'subscribe');
			})
			.catch(error => {
				this.showSnackbar('Something bad happened.');
				this.captcha.reset();
			});
	}
}

export default withStyles(styles)(Newsletter);

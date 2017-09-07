import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

const Logo = props => (
  <svg {...props} viewBox="0 0 512 512"><g><polygon points="182.39 213.5 182.39 298.5 256 341 329.61 298.5 329.61 213.5 256 171 182.39 213.5" /><polygon points="403.22 256 403.22 341 329.61 383.5 256 426 182.39 383.5 108.78 341 108.78 426 182.39 468.5 256 511 329.61 468.5 403.22 426 476.84 383.5 476.84 298.5 476.84 213.5 403.22 171 403.22 256" /><polygon points="108.78 256 108.78 171 182.39 128.5 256 86 329.61 128.5 403.22 171 403.22 86 329.61 43.5 256 1 182.39 43.5 108.78 86 35.16 128.5 35.16 213.5 35.16 298.5 108.78 341 108.78 256" fill="#212121" /></g></svg>
);
const TwitterIcon = props => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
  </svg>
);
const GitHubIcon = props => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
  </svg>
);
const FacebookIcon = props => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
  </svg>
);

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: [theme.spacing.unit * 2, theme.spacing.unit * 4],
    width: '100%',
    display: 'block',
    color: theme.palette.text.primary,
    fill: theme.palette.text.primary,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14
  },
  content: {
    padding: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    marginRight: 10
  }
});

const Footer = props => {
  const classes = props.classes;
  return (
    <div className={classes.root}>
        <div className={classes.content}>
          <Logo className={classes.logo} />
          <Link className={classes.link} to="about">About</Link>
          <Link className={classes.link} to="privacy">Privacy</Link>
        </div>
        <div className={classes.content}>
          <IconButton className={classes.button} aria-label="Twitter">
            <TwitterIcon className={classes.icon} aria-label="Twitter" />
          </IconButton>
          <IconButton className={classes.button} aria-label="GitHub">
            <GitHubIcon className={classes.icon} aria-label="GitHub" />
          </IconButton>
          <IconButton className={classes.button} aria-label="Facebook">
            <FacebookIcon className={classes.icon} aria-label="Facebook" />
          </IconButton>
        </div>
    </div>
  );
};

export default withStyles(styles)(Footer);
import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Hidden from 'material-ui/Hidden';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

import { LogoTextIcon, LogoIcon } from './Icons';

const styles = theme => ({
  root: {
  },
  logo: {
    width: 'auto',
    height: 24,
    fill: theme.palette.text.primary,
  },
  searchForm: {
    marginLeft: 'auto',
  },
  searchField: {
    backgroundColor: '#fff',
    paddingLeft: 8,
  },
});

class Header extends React.Component {
  state = {
    searchQuery: ''
  };

  render() {
    this.history = this.props.history;
    const classes = this.props.classes;
    return (
      <AppBar position="static" color="default" elevation={0} square={true}>
        <Toolbar>
          <Link to={''}>
            <Hidden only={'xs'}>
              <LogoTextIcon className={classes.logo} />
            </Hidden>
            <Hidden smUp>
              <LogoIcon className={classes.logo} />
            </Hidden>
          </Link>
          <form noValidate autoComplete="off" onSubmit={this.onSearch} className={classes.searchForm}>
            <TextField
              className={classes.searchField}
              onChange={this.handleChangeQuery}
              InputProps={{ disableUnderline: true }}
              placeholder="Search" />
          </form>
        </Toolbar>
      </AppBar>
    );
  }

  handleChangeQuery = event => {
    this.setState({ searchQuery: event.target.value });
  }

  onSearch = event => {
    event.preventDefault();
    window.location.assign(`/search/?q=${this.state.searchQuery}`);
  }
}

export default withStyles(styles)(Header);

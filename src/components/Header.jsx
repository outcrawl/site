import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

import { LogoTextIcon } from './Icons';

const styles = theme => ({
  root: {
    backgroundColor: '#fff',
    height: 64
  },
  logo: {
    width: 'auto',
    height: 24,
    '& path, & polygon': {
      fill: `${theme.palette.text.primary} !important`
    }
  },
  searchForm: {
    marginLeft: 'auto'
  },
  searchField: {
    backgroundColor: theme.palette.primary[100],
    padding: [0, 8]
  }
});

class Header extends React.Component {
  state = {
    searchQuery: ''
  };

  render() {
    const { classes, history } = this.props;
    this.history = history;
    return (
      <AppBar className={classes.root} position="static" elevation={0} square={true}>
        <Toolbar>
          <Link to={''}>
            <LogoTextIcon className={classes.logo} />
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
    this.history.push(`/search?q=${this.state.searchQuery}`);
  }
}

export default withStyles(styles)(Header);

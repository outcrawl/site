import React from 'react';
import Link from 'gatsby-link';

import withStyles from './ui/withStyles';
import ToolBar from './ui/ToolBar';
import TextField from './ui/TextField';
import Hidden from './ui/Hidden';
import { LogoTextIcon, LogoIcon } from './Icons';

const styles = theme => ({
  root: {
    backgroundColor: '#fff',
    height: 64
  },
  logo: {
    width: 'auto',
    height: 24,
    fill: theme.palette.text.primary
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
    this.history = this.props.history;
    const classes = this.props.classes;
    return (
      <ToolBar className={classes.root}>
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
      </ToolBar>
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

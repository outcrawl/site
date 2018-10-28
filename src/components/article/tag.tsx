import * as React from 'react';
import { Chip, createStyles, Theme, withStyles } from '@material-ui/core';
import { Link } from 'gatsby';
import classNames from 'classnames';

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    alignSelf: 'last baseline',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

interface TagProps {
  title: string;
  to?: string;
  classes?: {
    root: string;
  };
  className?: string;
}

class Tag extends React.PureComponent<TagProps> {
  public render() {
    const { title, to, classes, className } = this.props;

    return (
      <Link to={to} className={classNames(className, classes.root)}>
        <Chip onClick={() => null} label={title}/>
      </Link>
    );
  }
}

export default withStyles(styles)(Tag);

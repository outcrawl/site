import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';
import Chip from 'material-ui/Chip';
import classNames from 'classnames';

const styles = (theme) => ({
  root: {
    padding: [[theme.spacing.unit / 2, 0]],
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    alignSelf: 'last baseline',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

const Tag = ({ tag, className, classes }) => (
  <Link
    to={`/tags/${tag.slug}`}
    className={classNames(className, classes.root)}
  >
    <Chip onClick={() => {}} label={tag.name} />
  </Link>
);

export default withStyles(styles)(Tag);

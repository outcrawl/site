import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
  },
  tag: {
    margin: 4,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

const Tags = ({ article, classes }) => (
  <div className={classes.root}>
    {article.tags.map((tag, i) =>
      <Link key={i} className={classes.tag} to={`/tags/${article.slugTags[i]}/`}>
        <Chip label={tag} onClick={() => { }} />
      </Link>
    )}
  </div>
);

export default withStyles(styles)(Tags);

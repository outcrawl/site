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
    textDecoration: 'none'
  }
});

const Tags = ({ post, classes }) => (
  <div className={classes.root}>
    {post.tags.map((tag, i) =>
      <Link key={i} className={classes.tag} to={`/tags/${post.slugTags[i]}`}>
        <Chip label={tag} onClick={() => { }} />
      </Link>
    )}
  </div>
);

export default withStyles(styles)(Tags);

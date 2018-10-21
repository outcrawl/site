import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core';

import Article from './article';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  share: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: theme.spacing.unit,
    },
  },
});

interface ArticleHeaderProps {
  classes?: {
    root: string;
    share: string;
  };
  article: Article;
}

class ArticleHeader extends React.PureComponent<ArticleHeaderProps> {
  public render() {
    const { classes, article } = this.props;

    return (
      <section className={classes.root}>
        awdadw
      </section>
    );
  }
}

export default withStyles(styles)(ArticleHeader);

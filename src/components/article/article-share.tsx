import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import { FacebookButton, TwitterButton } from '../social-buttons';
import Article from './article';

const styles = (theme: Theme) => createStyles({
  socialButton: {
    marginLeft: theme.spacing.unit,
  },
});

interface ArticleShareProps {
  article: Article;
  className?: string;
  classes?: {
    socialButton: string;
  };
}

class ArticleShare extends React.PureComponent<ArticleShareProps> {
  public render() {
    const { article, className, classes } = this.props;

    return (
      <div className={className}>
        <TwitterButton
          component="a"
          variant="fab"
          mini
          href={`https://twitter.com/intent/tweet?url=${article.url}&text=${
            article.title
            }`}
          aria-label="Share on Twitter"
        />
        <FacebookButton
          className={classes.socialButton}
          component="a"
          variant="fab"
          mini
          href={`https://www.facebook.com/sharer/sharer.php?u=${article.url}`}
          aria-label="Share on Facebook"
        />
      </div>
    );
  }
}

export default withStyles(styles)(ArticleShare);
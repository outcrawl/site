import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import FacebookButton from '../assets/FacebookButton';
import TwitterButton from '../assets/TwitterButton';
import { ArticleData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  facebookButton: {
    marginLeft: theme.spacing(1),
  },
}));

type ArticleShareProps = {
  article: ArticleData;
} & React.HTMLAttributes<HTMLElement>;

const ArticleShare: React.FC<ArticleShareProps> = (props: ArticleShareProps) => {
  const { article, className } = props;
  const classes = useStyles();

  return (
    <div className={className}>
      <TwitterButton
        href={`https://twitter.com/intent/tweet?url=${article.url}&text=${
          article.title
        }`}
        aria-label="Share on Twitter"
      />
      <FacebookButton
        className={classes.facebookButton}
        href={`https://www.facebook.com/sharer/sharer.php?u=${article.url}`}
        aria-label="Share on Facebook"
      />
    </div>
  );
};

export default ArticleShare;

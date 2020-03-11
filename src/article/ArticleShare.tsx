import React from 'react';
import { ArticleInfo } from './types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TwitterButton from '../assets/TwitterButton';
import FacebookButton from '../assets/FacebookButton';

const useStyles = makeStyles((theme: Theme) => createStyles({
  socialButton: {
    marginLeft: theme.spacing(1),
  },
}));

type ArticleShareProps = {
  info: ArticleInfo;
} & React.HTMLAttributes<HTMLDivElement>;

const ArticleShare: React.FC<ArticleShareProps> = (props: ArticleShareProps) => {
  const { info, className } = props;
  const classes = useStyles();

  return (
    <div className={className}>
      <TwitterButton
        component="a"
        size="small"
        href={`https://twitter.com/intent/tweet?url=${info.url}&text=${
          info.title
        }`}
        aria-label="Share on Twitter"
      />
      <FacebookButton
        className={classes.socialButton}
        component="a"
        size="small"
        href={`https://www.facebook.com/sharer/sharer.php?u=${info.url}`}
        aria-label="Share on Facebook"
      />
    </div>
  );
};

export default ArticleShare;

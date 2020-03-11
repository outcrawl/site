import React from 'react';
import { ArticlePageData } from './types';
import classNames from 'classnames';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AuthorCard from '../author/AuthorCard';
import ArticleShare from './ArticleShare';

const useStyles = makeStyles((theme: Theme) => createStyles({
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
      marginTop: theme.spacing(1),
    },
  },
}));

type ArticleHeaderProps = {
  data: ArticlePageData;
} & React.HTMLAttributes<HTMLDivElement>;

const ArticleHeader: React.FC<ArticleHeaderProps> = (props: ArticleHeaderProps) => {
  const { data: { info }, className } = props;
  const classes = useStyles();

  return (
    <section className={classNames(classes.root, className)}>
      {info.author && <AuthorCard author={info.author} subtitle={info.date}/>}
      <ArticleShare info={info} className={classes.share}/>
    </section>
  );
};

export default ArticleHeader;

import React, { HTMLAttributes } from 'react';
import { ArticlePageData } from './types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tag from '../tag/Tag';
import ArticleShare from './ArticleShare';
import { Box } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  share: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
}));

type ArticleFooterProps = {
  articlePage: ArticlePageData;
} & HTMLAttributes<HTMLDivElement>;

const ArticleFooter: React.FC<ArticleFooterProps> = (props: ArticleFooterProps) => {
  const { articlePage, className } = props;
  const classes = useStyles();

  return (
    <Box component="section" className={classNames(className, classes.root)}>
      <div className={classes.tags}>
        {articlePage.tags.map((tag, i) => <Tag key={i} title={tag.title} to={`/tags/${tag.slug}`}/>)}
      </div>
      <ArticleShare articleInfo={articlePage.info} className={classes.share}/>
    </Box>
  );
};

export default ArticleFooter;

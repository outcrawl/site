import { Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import Tag from '../tag/Tag';
import ArticleShare from './ArticleShare';
import { ArticlePageData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  tag: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  share: {
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
}));

type ArticleFooterProps = {
  articlePage: ArticlePageData;
} & HTMLAttributes<HTMLElement>;

const ArticleFooter: React.FC<ArticleFooterProps> = (props: ArticleFooterProps) => {
  const { articlePage, className } = props;
  const classes = useStyles();

  return (
    <Box component="section" display="flex" className={classNames(className, classes.root)}>
      <Box display="flex" flexWrap="wrap">
        {articlePage.tags.map((tag, i) => (
          <Tag key={i} className={classes.tag} title={tag.title} to={`/tags/${tag.slug}`}/>
        ))}
      </Box>
      <ArticleShare article={articlePage.article} className={classes.share}/>
    </Box>
  );
};

export default ArticleFooter;

import React, { HTMLAttributes } from 'react';
import { ArticlePageData } from './types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tag from '../tag/Tag';
import ArticleShare from './ArticleShare';
import { Box } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  tag: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    // marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
} & HTMLAttributes<HTMLDivElement>;

const ArticleFooter: React.FC<ArticleFooterProps> = (props: ArticleFooterProps) => {
  const { articlePage, className } = props;
  const classes = useStyles();

  return (
    <Box component="section" display="flex" className={classNames(className, classes.root)}>
      <Box>
        {articlePage.tags.map((tag, i) => (
          <Tag key={i} className={classes.tag} title={tag.title} to={`/tags/${tag.slug}`}/>
        ))}
      </Box>
      <ArticleShare article={articlePage.article} className={classes.share}/>
    </Box>
  );
};

export default ArticleFooter;

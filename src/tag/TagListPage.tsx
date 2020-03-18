import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import React from 'react';
import BasicPageMeta from '../core/BasicPageMeta';
import Page from '../core/Page';
import { PageData } from '../core/types';
import { TagGroup } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
  },
  tag: {
    verticalAlign: 'middle',
    display: 'inline-block',
    lineHeight: 1,
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

type TagListPageProps = {
  page: PageData;
  tagGroups: TagGroup[];
};

const TagListPage: React.FC<TagListPageProps> = (props: TagListPageProps) => {
  const { page, tagGroups } = props;
  const classes = useStyles();

  return (
    <Page narrow>
      <BasicPageMeta {...page}/>
      <Box component="article">
        <Typography className={classes.title} variant="h1">Tags</Typography>
        <Box textAlign="center">
          {tagGroups.map(({ tag, size }) => (
            <Link
              key={tag.slug}
              className={classes.tag}
              to={`/tags/${tag.slug}/`}
              style={{ fontSize: Math.max(size * 10 / tagGroups[0].size, 1) + 'rem' }}
            >
              {tag.title}
            </Link>
          ))}
        </Box>
      </Box>
    </Page>
  );
};

export default TagListPage;

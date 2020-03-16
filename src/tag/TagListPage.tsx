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
    // TODO: same link as related article
  },
}));

type TagListPageProps = {
  tagListPage: PageData;
  tagGroups: TagGroup[];
};

const TagListPage: React.FC<TagListPageProps> = (props: TagListPageProps) => {
  const { tagListPage, tagGroups } = props;
  const classes = useStyles();

  return (
    <Page narrow>
      <BasicPageMeta
        title={tagListPage.title}
        description={tagListPage.description}
        url={tagListPage.url}
      />
      <Box component="article">
        <Typography className={classes.title} variant="h1">Tags</Typography>
        <Box>
          {tagGroups.map(({ tag, size }) => (
            <Link
              key={tag.slug}
              className={classes.tag}
              to={'/tags/' + tag.slug}
              style={{ fontSize: size + 'rem' }}
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

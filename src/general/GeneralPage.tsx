import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import BasicPageMeta from '../core/BasicPageMeta';
import Page from '../core/Page';
import PageContent from '../core/PageContent';
import { GeneralPageData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
  },
}));

type GeneralPageProps = {
  generalPage: GeneralPageData;
};

const GeneralPage: React.FC<GeneralPageProps> = (props: GeneralPageProps) => {
  const { generalPage } = props;
  const classes = useStyles();

  return (
    <Page narrow>
      <BasicPageMeta
        title={generalPage.title}
        description={generalPage.description}
        url={generalPage.url}
      />
      <Box component="article">
        <Typography className={classes.title} variant="h1">{generalPage.title}</Typography>
        <PageContent html={generalPage.html}/>
      </Box>
    </Page>
  );
};

export default GeneralPage;

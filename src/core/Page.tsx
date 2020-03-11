import React from 'react';
import Layout from './Layout';
import { Container, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    maxWidth: 1024,
    margin: '0px auto',
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(2),
    },
  },
  narrow: {
    maxWidth: 768,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

type PageProps = {
  children: React.ReactNode;
  narrow?: boolean;
};

const Page: React.FC<PageProps> = (props: PageProps) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container className={classNames(classes.root, { [classes.narrow]: props.narrow })}>
        {props.children}
      </Container>
    </Layout>
  );
};

export default Page;

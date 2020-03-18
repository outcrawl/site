import { blue } from '@material-ui/core/colors';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { HTMLAttributes } from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    ...theme.typography.body1,
    '& p': {
      margin: '1em 0',
    },
    '& h1': {
      ...theme.typography.h3,
    },
    '& h2': {
      ...theme.typography.h4,
    },
    '& h3': {
      ...theme.typography.h5,
    },
    '& h4': {
      ...theme.typography.h6,
    },
    '& table': {
      textAlign: 'left',
      borderSpacing: 0,
      borderCollapse: 'collapse',

      '& tr': {
        verticalAlign: 'middle',
      },
      '& th': {
        color: theme.palette.text.secondary,
        borderBottom: [[1, 'solid', theme.palette.divider]],
        padding: theme.spacing(0.5),
      },
      '& td': {
        borderBottom: [[1, 'solid', theme.palette.divider]],
        padding: theme.spacing(0.5),
      },
    },
    '& .heading-link': {
      '& svg': {
        verticalAlign: 'middle',
      },
    },
    '& blockquote': {
      padding: '1em',
      borderRadius: theme.shape.borderRadius,
      margin: 0,
      backgroundColor: blue[50],
      color: blue[900],
      '& p': {
        margin: 0,
      },
    },
    '& img': {
      display: 'block',
      maxWidth: '100%',
      margin: '0 auto',
    },
  },
}));

type PageContentProps = {
  html: string;
} & HTMLAttributes<HTMLElement>;

const PageContent: React.FC<PageContentProps> = (props: PageContentProps) => {
  const { html, ...rest } = props;
  const classes = useStyles();

  return <div className={classes.root} dangerouslySetInnerHTML={{ __html: html }} {...rest}/>;
};

export default PageContent;

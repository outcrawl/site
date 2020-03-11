import React, { HTMLAttributes } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '& p': {
      ...theme.typography.body1,
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
  },
}));

type PageContentProps = {
  html: string;
} & HTMLAttributes<HTMLDivElement>;

const PageContent: React.FC<PageContentProps> = (props: PageContentProps) => {
  const { html, ...rest } = props;
  const classes = useStyles();

  return <div className={classes.root} dangerouslySetInnerHTML={{ __html: html }} {...rest}/>;
};

export default PageContent;

import * as React from 'react';
import { createStyles, Grid, IconButton, Theme, Typography, withStyles } from '@material-ui/core';
import { Link } from 'gatsby';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: 0,
    paddingRight: 0,
  },
  button: {
    width: 48,
    height: 48,
    '&:hover': {
      textDecoration: 'none',
    },
    '& span': {
      color: 'inherit',
    },
  },
});

interface PaginationProps {
  pageNumber: number;
  articlesPerPage: number;
  totalArticles: number;
  basePath?: string;
  classes?: {
    root: string;
    button: string;
  };
}

interface PaginationButton {
  disabled: boolean;
  component: any;
  aria: string;
  icon: any;
}

class Pagination extends React.PureComponent<PaginationProps> {
  public render() {
    const { pageNumber, articlesPerPage, totalArticles, classes } = this.props;
    let { basePath } = this.props;
    basePath = basePath || '';

    const pageCount = Math.ceil(totalArticles / articlesPerPage);

    const previousPageLink = ({ children, ...rest }: any) => (
      <Link to={pageNumber === 2 ? basePath || '/' : `${basePath}/page/${pageNumber - 1}`} {...rest}>
        {children}
      </Link>
    );

    const nextPageLink = ({ children, ...rest }: any) => (
      <Link to={`${basePath}/page/${pageNumber + 1}`} {...rest}>
        {children}
      </Link>
    );

    let buttons: PaginationButton[] = [];

    if (pageNumber === 1) {
      buttons.push({
        disabled: true,
        component: 'span',
        aria: 'Previous page',
        icon: <ChevronLeft/>,
      });
    } else {
      buttons.push({
        disabled: false,
        component: previousPageLink,
        aria: 'Previous page',
        icon: <ChevronLeft/>,
      });
    }

    for (let i = 1; i <= pageCount; i++) {
      if (pageNumber === i) {
        buttons.push({
          disabled: true,
          component: 'span',
          aria: `Go to page ${i}`,
          icon: <Typography variant="button">{i}</Typography>,
        });
      } else {
        buttons.push({
          disabled: false,
          component: ({ children, ...rest }: any) => (
            <Link to={i === 1 ? basePath || '/' : `${basePath}/page/${i}`} {...rest}>
              {children}
            </Link>
          ),
          aria: `Go to page ${i}`,
          icon: <Typography variant="button">{i}</Typography>,
        });
      }
    }

    if (pageNumber === pageCount) {
      buttons.push({
        disabled: true,
        component: 'span',
        aria: 'Next page',
        icon: <ChevronRight/>,
      });
    } else {
      buttons.push({
        disabled: false,
        component: nextPageLink,
        aria: 'Next page',
        icon: <ChevronRight/>,
      });
    }

    return (
      <Grid item xs={12} className={classes.root} component="section">
        {buttons.map((b, index) => (
          <IconButton
            className={classes.button}
            key={index}
            disabled={b.disabled}
            component={b.component}
            aria-label={b.aria}>
            {b.icon}
          </IconButton>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(Pagination);

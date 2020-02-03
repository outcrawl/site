import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Box, IconButton, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
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
}));

type PaginationProps = {
  pageNumber: number;
  articlesPerPage: number;
  totalArticles: number;
  basePath?: string;
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  const classes = useStyles();
  const { pageNumber, articlesPerPage, totalArticles } = props;
  const basePath = props.basePath || '';

  const pageCount = Math.ceil(totalArticles / articlesPerPage);

  let buttons: React.ReactNode[] = [];

  buttons.push(
    <IconButton
      key={buttons.length}
      className={classes.button}
      aria-label="Previous page"
      disabled={pageNumber === 1}
      component={pageNumber === 1 ? 'span' : (
        ({ children, className }) => (
          <Link to={pageNumber === 2 ? basePath || '/' : `${basePath}/page/${pageNumber - 1}`} className={className}>
            {children}
          </Link>
        )
      )}>
      <ChevronLeft/>
    </IconButton>,
  );

  for (let i = 1; i <= pageCount; i++) {
    buttons.push(
      <IconButton
        key={buttons.length}
        className={classes.button}
        aria-label={`Go to page ${i}`}
        disabled={pageNumber === i}
        component={pageNumber === i ? 'span' : (
          ({ children, className }) => (
            <Link to={i === 1 ? basePath || '/' : `${basePath}/page/${i}`} className={className}>
              {children}
            </Link>
          )
        )}>
        <Typography variant="button">{i}</Typography>
      </IconButton>,
    );
  }

  buttons.push(
    <IconButton
      key={buttons.length}
      className={classes.button}
      aria-label="Next page"
      disabled={pageNumber === pageCount}
      component={pageNumber === pageCount ? 'span' : (
        ({ children, className }) => (
          <Link to={`${basePath}/page/${pageNumber + 1}`} className={className}>
            {children}
          </Link>
        )
      )}>
      <ChevronRight/>
    </IconButton>,
  );

  return (
    <Box className={classes.root}>
      {buttons}
    </Box>
  );
};

export default Pagination;

import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import ButtonBase from 'material-ui/ButtonBase';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText } from 'material-ui/List';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit,
  },
  cover: {
    flexGrow: 1,
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: 200,
    [theme.breakpoints.up('lg')]: {
      height: 250,
    },
    [theme.breakpoints.up('xl')]: {
      height: 300,
    },
  },
  header: {
    paddingTop: 0,
  },
  avatar: {
    border: [[1, 'solid', theme.palette.divider]],
  },
  titleLink: {
    textDecoration: 'none',
  },
  authorLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

const ArticleLink = ({ to, ...rest }) => <Link to={to} {...rest} />;

const Entry = ({ article, classes }) => (
  <Grid item xs={12} sm={6} className={classes.root}>
    <Card>
      <ButtonBase
        alt={article.title}
        component={ArticleLink}
        to={article.slug}
        focusRipple
        className={classes.cover}
        style={{ backgroundImage: `url(${article.coverUrl})` }}
      />
      <CardContent>
        <Link to={article.slug} className={classes.titleLink}>
          <Typography variant="headline" component="h2">
            {article.title}
          </Typography>
        </Link>
      </CardContent>
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar
            className={classes.avatar}
            alt={article.author.name}
            src={`https://www.gravatar.com/avatar/${
              article.author.emailHash
            }?s=120`}
          />
        }
        title={
          <Link
            to={`/authors/${article.author.slug}`}
            className={classes.authorLink}
          >
            {article.author.name}
          </Link>
        }
        subheader={article.date}
      />
    </Card>
  </Grid>
);

export default withStyles(styles)(Entry);

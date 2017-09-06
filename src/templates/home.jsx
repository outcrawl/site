import React from 'react';
import Link from 'gatsby-link';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import Entry from '../components/Entry';
import Pagination from '../components/Pagination';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1024,
    margin: [24, 'auto', 24, 'auto']
  }
});

const Home = (props) => {
  const { data, pathContext, classes } = props;

  const page = pathContext.skip / pathContext.limit + 1;
  const total = Math.floor(pathContext.total / pathContext.limit);
  const posts = data.allMarkdownRemark.edges
    .map(({ node }) => Object.assign({}, node.frontmatter, node.fields));

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        {posts.map(post =>
          <Grid key={post.slug} item xs={12} sm={6}>
            <Entry post={post} />
          </Grid>
        )}
      </Grid>
      <Pagination page={page} total={total} />
    </div>
  );
};

export default withStyles(styles)(Home);

export const query = graphql`
query HomeQuery($skip: Int!, $limit: Int!) {
  allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {layout: {eq: "post"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          author
          date(formatString: "DD MMMM, YYYY")
        }
        fields {
          slug
        }
      }
    }
  }
}
`;

import * as React from 'react';
import { Link } from 'gatsby';
import { ButtonBase, Card, CardContent, Grid, Typography } from '@material-ui/core';

import { Article } from './article';

interface ArticleCardProps {
  article: Article;
}

const ArticleLink = ({ to, ...rest }: any) => <Link to={to} {...rest} />;

export class ArticleCard extends React.PureComponent<ArticleCardProps, {}> {
  public render() {
    const { article } = this.props;

    return (
      <Grid item xs={12} sm={6}>
        <Card>
          <ButtonBase
            focusRipple
            component={ArticleLink}
            style={{ backgroundImage: `url(${article.cover})` }}
          />
          <CardContent>
            <Link to={article.slug}>
              <Typography variant="headline" component="h2">
                {article.title}
              </Typography>
            </Link>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

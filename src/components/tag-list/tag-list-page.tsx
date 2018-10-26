import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import Page from '../page/page';
import PageSection from '../page/page-section';
import { Link } from 'gatsby';
import { TagGroup } from './types';

const styles = () => createStyles({
  tag: {
    marginRight: '0.4em',
    display: 'inline-block',
  },
});

interface TagListPageProps {
  tags: TagGroup[];
  classes?: {
    tag: string;
  }
}

interface DisplayedTagGroup extends TagGroup {
  fontSize: number;
}

class TagListPage extends React.PureComponent<TagListPageProps> {
  public render() {
    const { tags, classes } = this.props;

    const dt: DisplayedTagGroup[] = tags.map((tag) => ({
      ...tag,
      fontSize: Math.max(Math.log(tag.size * 30 / tags[0].size), 1),
    }));

    return (
      <Page narrow>
        <PageSection component="section">
          <h1>Tags</h1>
          <p>
            {dt.map((tag, i) => (
              <Link className={classes.tag}
                    key={i}
                    style={{ fontSize: `${tag.fontSize}rem` }}
                    to={`/tags/${tag.slug}`}>
                {tag.title}
              </Link>
            ))}
          </p>
        </PageSection>
      </Page>
    );
  }
}

export default withStyles(styles)(TagListPage);

import * as React from 'react';
import { TagGroup, TagListPage } from '../components/tag-list';

interface TagListTemplateProps {
  pathContext: {
    tagGroups: TagGroup[];
  }
}

class TagListTemplate extends React.PureComponent<TagListTemplateProps> {
  public render() {
    const { pathContext: { tagGroups } } = this.props;

    return <TagListPage tags={tagGroups}/>;
  }
}

export default TagListTemplate;

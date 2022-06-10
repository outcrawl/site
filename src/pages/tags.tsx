import TagListPage from '../tag/TagListPage';
import { loadTags } from '../tag/data';
import { TagGroupData } from '../tag/types';
import { GetStaticProps, NextPage } from 'next';

type TagListPageRouteProps = {
  tags: TagGroupData[];
};

const TagListPageRoute: NextPage<TagListPageRouteProps> = ({
  tags,
}: TagListPageRouteProps) => <TagListPage tags={tags} />;

export default TagListPageRoute;

export const getStaticProps: GetStaticProps<
  TagListPageRouteProps
> = async () => {
  const tags = await loadTags();
  return Promise.resolve({
    props: {
      tags,
    },
  });
};

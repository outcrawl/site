import { loadArticles } from '../../../article/data';
import { ArticleData } from '../../../article/types';
import { loadConfig } from '../../../config';
import TagPage from '../../../tag/TagPage';
import { loadTag, loadTags } from '../../../tag/data';
import { TagData } from '../../../tag/types';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type TagPageRouteProps = {
  tag: TagData;
  articles: ArticleData[];
  pageCount: number;
};

type TagPageRouteQuery = { slug: string };

const TagPageRoute: NextPage<TagPageRouteProps> = ({
  tag,
  articles,
  pageCount,
}: TagPageRouteProps) => (
  <TagPage tag={tag} articles={articles} page={1} pageCount={pageCount} />
);

export default TagPageRoute;

export const getStaticProps: GetStaticProps<
  TagPageRouteProps,
  TagPageRouteQuery
> = async ({ params }) => {
  if (params === undefined) {
    throw Error('Not found');
  }

  const tag = await loadTag(params.slug);
  if (tag === undefined) {
    throw new Error(`Tag '${params.slug}' not found`);
  }

  const config = loadConfig();
  const articles = (await loadArticles()).filter((article) =>
    article.tags.some((articleTag) => articleTag.slug === tag.slug),
  );
  const pageCount = Math.ceil(articles.length / config.articlesPerPage);

  return Promise.resolve({
    props: {
      tag,
      articles: articles.slice(0, config.articlesPerPage),
      pageCount,
    },
  });
};

export const getStaticPaths: GetStaticPaths<TagPageRouteQuery> = async () => {
  const tags = await loadTags();
  return {
    paths: tags.map((tag) => ({ params: { slug: tag.slug } })),
    fallback: false,
  };
};

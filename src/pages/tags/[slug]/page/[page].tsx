import { loadArticles } from '../../../../article/data';
import { ArticleData } from '../../../../article/types';
import { loadConfig } from '../../../../config';
import TagPage from '../../../../tag/TagPage';
import { loadTag, loadTags } from '../../../../tag/data';
import { TagData } from '../../../../tag/types';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type TagPageRoutePagedProps = {
  tag: TagData;
  articles: ArticleData[];
  page: number;
  pageCount: number;
};

type TagPageRoutePagedQuery = { slug: string; page: string };

const TagPageRoutePaged: NextPage<
  TagPageRoutePagedProps,
  TagPageRoutePagedQuery
> = ({ tag, articles, page, pageCount }: TagPageRoutePagedProps) => (
  <TagPage tag={tag} articles={articles} page={page} pageCount={pageCount} />
);

export default TagPageRoutePaged;

export const getStaticProps: GetStaticProps<
  TagPageRoutePagedProps,
  TagPageRoutePagedQuery
> = async ({ params }) => {
  if (params === undefined) {
    throw Error('Not found');
  }
  const tag = await loadTag(params.slug);
  if (tag === undefined) {
    throw new Error(`Tag '${params.slug}' not found`);
  }
  const page = Number(params.page);

  const config = loadConfig();
  const articles = (await loadArticles()).filter((article) =>
    article.tags.some((articleTag) => articleTag.slug === tag.slug),
  );
  const pageCount = Math.ceil(articles.length / config.articlesPerPage);

  return Promise.resolve({
    props: {
      tag,
      articles: articles.slice(
        (page - 1) * config.articlesPerPage,
        (page - 1) * config.articlesPerPage + config.articlesPerPage,
      ),
      page,
      pageCount,
    },
  });
};

export const getStaticPaths: GetStaticPaths<
  TagPageRoutePagedQuery
> = async () => {
  const config = loadConfig();
  const tags = await loadTags();
  return {
    paths: tags.flatMap((tag) =>
      Array.from(
        Array(Math.ceil(tag.articleCount / config.articlesPerPage)),
      ).map((_, i) => ({
        params: { slug: tag.slug, page: (i + 1).toString() },
      })),
    ),
    fallback: false,
  };
};

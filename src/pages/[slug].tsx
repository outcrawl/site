import ArticlePage from '../article/ArticlePage';
import { loadArticle, loadArticles } from '../article/data';
import { ArticleData } from '../article/types';
import { shuffle } from '../common/arrayUtility';
import GeneralPage from '../general-page/GeneralPage';
import { loadGeneralPage, loadGeneralPages } from '../general-page/data';
import { GeneralPageData } from '../general-page/types';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type PageRouteProps = {
  article?: {
    article: ArticleData;
    related: ArticleData[];
  };
  page?: GeneralPageData;
};

type PageRouteQuery = { slug: string };

const PageRoute: NextPage<PageRouteProps> = ({
  article,
  page,
}: PageRouteProps) => {
  if (article !== undefined) {
    if (article.article.containsMath) {
      require('katex/dist/katex.min.css');
    }
    return <ArticlePage article={article.article} related={article.related} />;
  }
  if (page !== undefined) {
    return <GeneralPage page={page} />;
  }
  return null;
};

export default PageRoute;

export const getStaticProps: GetStaticProps<
  PageRouteProps,
  PageRouteQuery
> = async ({ params }) => {
  if (params === undefined) {
    throw Error('Not found');
  }

  const article = await loadArticle(params.slug);
  if (article !== undefined) {
    const articles = await loadArticles();
    const related: ArticleData[] = shuffle(
      articles.filter(
        (related) =>
          related.slug !== article.slug &&
          related.tags.find((relatedTag) =>
            article.tags.find((tag) => tag.slug === relatedTag.slug),
          ) !== undefined,
      ),
    ).slice(0, 3);

    return Promise.resolve({ props: { article: { article, related } } });
  }

  const page = await loadGeneralPage(params.slug);
  if (page === undefined) {
    throw new Error(`Page '${params.slug}' not found`);
  }
  return Promise.resolve({ props: { page } });
};

export const getStaticPaths: GetStaticPaths<PageRouteQuery> = async () => {
  const articles = await loadArticles();
  const pages = await loadGeneralPages();
  return {
    paths: [
      ...articles.map((article) => ({ params: { slug: article.slug } })),
      ...pages.map((page) => ({ params: { slug: page.slug } })),
    ],
    fallback: false,
  };
};

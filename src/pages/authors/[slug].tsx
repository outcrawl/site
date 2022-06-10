import { loadArticles } from '../../article/data';
import { ArticleData } from '../../article/types';
import AuthorPage from '../../author/AuthorPage';
import { loadAuthor, loadAuthors } from '../../author/data';
import { AuthorData } from '../../author/types';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type AuthorRouteProps = {
  author: AuthorData;
  articles: ArticleData[];
};

type AuthorRouteQuery = { slug: string };

const AuthorRoute: NextPage<AuthorRouteProps> = ({
  author,
  articles,
}: AuthorRouteProps) => <AuthorPage author={author} articles={articles} />;

export default AuthorRoute;

export const getStaticProps: GetStaticProps<
  AuthorRouteProps,
  AuthorRouteQuery
> = async ({ params }) => {
  if (params === undefined) {
    throw Error('Not found');
  }

  const author = loadAuthor(params.slug);
  if (author === undefined) {
    throw new Error(`Author '${params.slug}' not found`);
  }

  const articles = (await loadArticles()).filter(
    (article) => article.author?.slug === author.slug,
  );

  return Promise.resolve({ props: { author, articles } });
};

export const getStaticPaths: GetStaticPaths<AuthorRouteQuery> = () => {
  const authors = loadAuthors();
  return {
    paths: authors.map((author) => ({ params: { slug: author.slug } })),
    fallback: false,
  };
};

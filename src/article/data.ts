import { loadAuthor } from '../author/data';
import { loadConfig } from '../config';
import { compileMDX } from '../mdx/compile';
import { ArticleData, ArticleKind } from './types';
import fs from 'fs';
import path from 'path';
import toSlug from 'slug';

const ARTICLES_DIR = path.join(process.cwd(), 'data/articles');
const ARTICLE_INDEX_FILE = 'index.mdx';

type ArticleFrontmatter = {
  title: string;
  author?: string;
  description: string;
  cover?: ArticleCoverFrontmatter;
  kind?: ArticleKind;
  tags?: string[];
};

type ArticleCoverFrontmatter = {
  path: string;
  width: number;
  height: number;
};

export async function loadArticles(): Promise<ArticleData[]> {
  const articles: ArticleData[] = [];
  for (const articleDir of fs.readdirSync(ARTICLES_DIR)) {
    const article = await readArticle(articleDir);
    if (article !== undefined) {
      articles.push(article);
    }
  }
  return Promise.resolve(
    articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );
}

export async function loadArticle(
  slug: string,
): Promise<ArticleData | undefined> {
  const articles = await loadArticles();
  const article = articles.find((article) => article.slug === slug);
  if (article === undefined) {
    return Promise.resolve(undefined);
  }

  const source = fs.readFileSync(
    path.join('data', article.assetPath, ARTICLE_INDEX_FILE),
    'utf8',
  );
  const { mdx } = await compileMDX<ArticleFrontmatter>(
    source,
    path.resolve(`data${article.assetPath}`),
  );
  article.content = { compiledSource: mdx.compiledSource, scope: mdx.scope };
  article.containsMath = mdx.compiledSource.indexOf('class="katex"') !== -1;

  return Promise.resolve(article);
}

async function readArticle(dir: string): Promise<ArticleData | undefined> {
  const slug = dir.substring(11);
  const date = dir.substring(0, 10);
  if (isNaN(Date.parse(date))) {
    throw new Error(`Invalid article '${slug}' date '${date}'`);
  }

  const source = fs.readFileSync(
    path.join(ARTICLES_DIR, dir, ARTICLE_INDEX_FILE),
    'utf8',
  );
  const { frontmatter } = await compileMDX<ArticleFrontmatter>(
    source,
    path.resolve(`data/articles/${date}-${slug}`),
  );

  const config = loadConfig();
  const article: ArticleData = {
    slug,
    kind: frontmatter.kind || ArticleKind.STANDARD,
    url: `${config.url}/${slug}`,
    title: frontmatter.title,
    author:
      frontmatter.author !== undefined
        ? loadAuthor(frontmatter.author)
        : undefined,
    description: frontmatter.description,
    assetPath: `/articles/${date}-${slug}`,
    date: new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    tags: (frontmatter.tags || []).map((title) => {
      const slug = toSlug(title, { lower: true });
      return {
        title,
        slug,
        url: `${config.url}/tags/${slug}`,
      };
    }),
  };

  if (frontmatter.cover) {
    article.cover = {
      path: `${article.assetPath}/${frontmatter.cover.path.substring(
        frontmatter.cover.path.indexOf('/') + 1,
      )}`,
      width: frontmatter.cover.width || 1280,
      height: frontmatter.cover.height || 720,
    };
  }

  return Promise.resolve(article);
}

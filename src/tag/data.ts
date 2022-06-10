import { loadArticles } from '../article/data';
import { TagData, TagGroupData } from './types';

export async function loadTags(): Promise<TagGroupData[]> {
  const articles = await loadArticles();
  return Promise.resolve(
    articles
      .reduce((tags, article) => {
        for (const tag of article.tags) {
          const existingTag = tags.find(
            (existingTag) => existingTag.slug === tag.slug,
          );
          if (existingTag === undefined) {
            tags.push({ ...tag, articleCount: 1 });
          } else {
            existingTag.articleCount++;
          }
        }
        return tags;
      }, [] as TagGroupData[])
      .sort((a, b) => {
        const ord = b.articleCount - a.articleCount;
        return ord === 0 ? a.title.localeCompare(b.title) : ord;
      }),
  );
}

export async function loadTag(slug: string): Promise<TagData | undefined> {
  const tags = await loadTags();
  return Promise.resolve(tags.find((tag) => tag.slug === slug));
}

import authorsData from '../../data/authors.json';
import { loadConfig } from '../config';
import { AuthorData } from './types';

export function loadAuthors(): AuthorData[] {
  const authors = authorsData as AuthorData[];
  const config = loadConfig();
  return authors.map((author) => ({
    ...author,
    url: `${config.url}/authors/${author.slug}`,
  }));
}

export function loadAuthor(slug: string): AuthorData | undefined {
  return loadAuthors().find((author) => author.slug === slug);
}

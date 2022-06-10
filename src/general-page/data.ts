import { loadConfig } from '../config';
import { compileMDX } from '../mdx/compile';
import { GeneralPageData } from './types';
import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'data/pages');

type PageFrontmatter = {
  title: string;
  description: string;
};

export async function loadGeneralPages(): Promise<GeneralPageData[]> {
  const pages: GeneralPageData[] = [];
  for (const pageFile of fs.readdirSync(PAGES_DIR)) {
    const page = await readGeneralPage(pageFile);
    if (page !== undefined) {
      pages.push(page);
    }
  }
  return Promise.resolve(pages);
}

export async function loadGeneralPage(
  slug: string,
): Promise<GeneralPageData | undefined> {
  const pages = await loadGeneralPages();
  return Promise.resolve(pages.find((page) => page.slug === slug));
}

async function readGeneralPage(
  pageFile: string,
): Promise<GeneralPageData | undefined> {
  const slug = pageFile.substring(0, pageFile.length - 4);

  const source = fs.readFileSync(path.join(PAGES_DIR, pageFile), 'utf8');
  const { mdx, frontmatter } = await compileMDX<PageFrontmatter>(
    source,
    path.resolve(`data/pages/${pageFile}`),
  );

  const config = loadConfig();

  const page: GeneralPageData = {
    slug,
    url: `${config.url}/${slug}`,
    title: frontmatter.title,
    description: frontmatter.description,
    assetPath: `pages/${slug}`,
    content: mdx,
  };

  return Promise.resolve(page);
}

import rehypePrism from './rehypePrism';
import { MDXSource } from './types';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeImgSize from 'rehype-img-size';
import rehypeKatex from 'rehype-katex';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { Pluggable, PluggableList } from 'unified';

export async function compileMDX<Frontmatter>(
  source: string,
  sourceDir?: string,
): Promise<{ mdx: MDXSource; frontmatter: Frontmatter }> {
  const { content, data } = matter(source);

  const rehypePlugins: PluggableList = [rehypeKatex, rehypePrism];
  if (sourceDir !== undefined) {
    rehypePlugins.push([rehypeImgSize, { dir: sourceDir }] as Pluggable);
  }
  const mdx = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
      rehypePlugins,
      format: 'mdx',
    },
    scope: data,
  });
  return Promise.resolve({ mdx, frontmatter: data as Frontmatter });
}

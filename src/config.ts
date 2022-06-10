import { NextConfig } from 'next';
import getConfig from 'next/config';

export type Config = {
  url: string;
  title: string;
  description: string;
  copyright: string;
  twitterId: string;
  facebookId: string;
  articlesPerPage: number;
};

export function loadConfig(): Config {
  const { publicRuntimeConfig } = getConfig() as NextConfig;
  return publicRuntimeConfig as Config;
}

/* eslint-disable */
const config = {
  url: 'http://localhost:3000',
  title: 'Outcrawl',
  description: 'Software engineering without nonsense',
  copyright: '2021 © Outcrawl. All rights reserved.',
  twitterId: '@tinrab',
  facebookId: '863987620425609',
  articlesPerPage: 8,
};
if (process.env.NODE_ENV === 'production') {
  config.url = 'https://outcrawl.com';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
  },
  compiler: {
    emotion: true,
  },
  basePath: '',
  publicRuntimeConfig: config,
  images: {
    loader: 'custom',
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    nextImageExportOptimizer: {
      imageFolderPath: 'public',
      exportFolderPath: 'public',
      quality: 75,
    },
  },
  env: {
    storePicturesInWEBP: true,
    generateAndUseBlurImages: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
      path: false,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;

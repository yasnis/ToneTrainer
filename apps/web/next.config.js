// apps/web/next.config.js  ← 拡張子は .js のまま
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  scope: '/tonetrainer/',
  sw: 'sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  basePath: '/tonetrainer',
  assetPrefix: '/tonetrainer',
  env: { NEXT_PUBLIC_BASE_PATH: '/tonetrainer' },

  transpilePackages: [
    'react-native',
    'react-native-web',
    'nativewind',
    '@tone-trainer/ui',
    '@tone-trainer/core',
  ],

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);

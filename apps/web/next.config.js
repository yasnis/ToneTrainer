/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "react-native",
    "react-native-web",
    "nativewind",
    "@tone-trainer/ui",
    "@tone-trainer/core"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    };
    return config;
  }
};

module.exports = nextConfig;
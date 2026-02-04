/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 修复开发环境下的 CSS 热更新错误
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig

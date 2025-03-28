/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Configure for GitHub Pages with a repository name
  // The basePath should match your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/REPOSITORY-NAME' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/REPOSITORY-NAME/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 
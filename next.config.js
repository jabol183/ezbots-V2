/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure export settings only for production builds
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    // Configure for GitHub Pages when in production
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/ezbots-V2',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/ezbots-V2',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  } : {
    // Development settings
    trailingSlash: false,
  }),
  
  // Add environment variables to identify when middleware should be skipped
  env: {
    NEXT_PUBLIC_SKIP_MIDDLEWARE: process.env.NODE_ENV === 'production' ? 'true' : 'false',
  }
}

module.exports = nextConfig 
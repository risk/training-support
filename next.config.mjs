/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.BASE_PATH || '',
  distDir: 'build',
  output: process.env.STATIC_PAGE === '1' ? 'export' : undefined
}

export default nextConfig

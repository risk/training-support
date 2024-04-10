/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.BASE_PATH || '',
  distDir: 'build',
  output: 'export'
}

export default nextConfig

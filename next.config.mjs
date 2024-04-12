/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.BASE_PATH || '',
  distDir: 'build',
  output: process.env.OUTPUT
}

export default nextConfig

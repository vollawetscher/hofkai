/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack to avoid WASM binding issues
  experimental: {
    turbo: false,
  },
}

export default nextConfig

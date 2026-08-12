/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.API_URL}/uploads/:path*`,
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: process.env.BACKEND_PROTOCOL,
        hostname: process.env.BACKEND_HOST,
      },
    ]
  }
};

export default nextConfig;

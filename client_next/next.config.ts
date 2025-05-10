import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost', 
      'stackruet.com', 
      'res.cloudinary.com',
      'images.unsplash.com',
      'placehold.co',
      'placekitten.com'
      // Add other domains where your images are hosted
    ],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
};

export default nextConfig;

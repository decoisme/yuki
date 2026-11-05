/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'fxbtbopcmqxfohfwuhso.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
export default nextConfig;

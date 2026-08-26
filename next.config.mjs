/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Tắt strict mode kép để camera stream và html5-qrcode không bị mount/unmount 2 lần liên tiếp
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;

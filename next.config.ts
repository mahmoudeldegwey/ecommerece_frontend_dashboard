import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */

   reactStrictMode: true,
   images: {
      domains: ['127.0.0.1','placehold.co','twinz-shop.com'],
   },
};

//export default nextConfig;
export default withNextIntl(nextConfig);
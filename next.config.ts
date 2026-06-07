import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  // ✅ Static export -> generates /out
  // ✅ Static export disabled to allow API routes to work
  // output: "export",

  // ✅ Important for static hosting (Netlify): /about -> /about/
  trailingSlash: true,

  images: {
    dangerouslyAllowSVG: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /**
   * NOTE:
   * - nextConfig.headers() does NOT apply when using `output: "export"`.
   * - Use Netlify headers via `public/_headers` instead.
   */
};

export default nextConfig;

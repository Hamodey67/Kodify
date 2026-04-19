import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  // ✅ Static export -> generates /out
  output: "export",

  // ✅ Important for static hosting (Netlify): /about -> /about/
  trailingSlash: true,

  images: {
    // ✅ Required with static export to avoid Image Optimization server
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },

  /**
   * NOTE:
   * - nextConfig.headers() does NOT apply when using `output: "export"`.
   * - Use Netlify headers via `public/_headers` instead.
   */
};

export default nextConfig;

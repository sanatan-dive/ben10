import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains:['pbs.twimg.com']
  },
  webpack(config, { isServer }) {
    // Exclude source maps from being processed
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
    });

    // Optionally: Disable source maps for production builds
    if (!isServer) {
      config.devtool = false;
    }

    return config;

},
};

export default nextConfig;

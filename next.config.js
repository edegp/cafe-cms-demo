/** @type {import('next').NextConfig} */
const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});
const nextConfig = {
  images: {
    domains: ["images.microcms-assets.io", "images.unsplash.com"],
  },
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  modules: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  i18n: {
    defaultLocale: "ja",
    locales: ["ja"],
  },
  node: {
    fs: "empty",
  },
};

module.exports = withBundleAnalyzer(nextConfig);

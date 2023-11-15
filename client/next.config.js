/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value:
  //             "default-src '*'; font-src 'self'; img-src 'self' https://*.stripe.com; script-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net https://checkout.stripe.com; style-src 'self' https://js.stripe.com; frame-src 'self' https://checkout.stripe.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com; worker-src 'self'",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = withBundleAnalyzer(nextConfig);

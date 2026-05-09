/** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
//   images: {
//     domains: ["digimonk.co", "api.azubiregional.de"],
//   },
// };

// module.exports = nextConfig;
/** @type {import('next').NextConfig} */

// const nextConfig = {
//   reactStrictMode: true,
// }

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "digimonk.live",
      },
      {
        protocol: "https",
        hostname: "api.azubiregional.de",
      },
      {
        protocol: "https",
        hostname: "digimonk.net",
      },
    ],
  },
};

module.exports = nextConfig;

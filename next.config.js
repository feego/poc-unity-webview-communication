const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [
      withImages({
        esModule: true,
        webpack(config) {
          return config;
        },
      }),
    ],
  ],
  {
    env: {
      SITE_URL: process.env.SITE_URL,
      GTM_ID: process.env.GTM_ID,
    },
  }
);

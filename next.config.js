/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  target: 'serverless',
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
});

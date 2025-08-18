// webpack.karma.cjs
const webpack = require('webpack');

module.exports = {
  plugins: [
    // Replace imports like "node:fs" -> "fs"
    // so normal resolution rules (and our fallbacks) apply.
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, '');
    }),
  ],
  resolve: {
    // In Webpack 5, built-in Node polyfills were removed.
    // Explicitly mark server-only modules as unavailable in the browser.
    // This avoids trying to bundle them during Karma runs.
    fallback: {
      fs: false,
      path: false,
      url: false,
      module: false,
      child_process: false,
      worker_threads: false,
    },
  },
  externals: {
    // If anything still tries to require these at runtime,
    // keep them external (don’t bundle). They won’t exist in the browser.
    'node:fs': 'commonjs node:fs',
    fs: 'commonjs fs',
  },
};

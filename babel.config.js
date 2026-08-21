const path = require('path');

// babel-preset-expo isn't hoisted to the project root in this install (it lives nested
// under node_modules/expo/node_modules/babel-preset-expo), so resolve it starting from
// expo's own directory instead of relying on plain module-name resolution.
const babelPresetExpoPath = require.resolve('babel-preset-expo', {
  paths: [path.dirname(require.resolve('expo/package.json'))],
});

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [[babelPresetExpoPath, { reanimated: false }]],
  };
};

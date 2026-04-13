const path = require('path');

module.exports = function (api) {
  api.cache(true);

  // Use the babel-preset-expo bundled inside the expo package
  // to ensure the expo-router Babel plugin version matches the Metro config.
  const presetPath = path.resolve(
    __dirname,
    'node_modules/expo/node_modules/babel-preset-expo'
  );

  return {
    presets: [presetPath],
    plugins: ['react-native-reanimated/plugin'],
  };
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["module:babel-preset-expo"],
    plugins: [
      // Required for expo-router
      // "expo-router/babel",
      "react-native-reanimated/plugin",
    ],
  };
};

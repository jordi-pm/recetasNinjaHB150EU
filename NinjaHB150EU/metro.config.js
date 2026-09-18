const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// los PDF oficiales viajan dentro de la app
config.resolver.assetExts.push('pdf');

module.exports = config;

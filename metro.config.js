const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter la résolution pour les modules React Native
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configurer les extensions de fichiers
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'mjs', 'cjs'];

// Configurer les alias si nécessaire
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

// Résoudre les problèmes avec les modules ESM de Supabase
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config; 
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude backend and venv directories from Metro watcher
config.watchFolders = config.watchFolders || [];
config.resolver.blockList = [
  /backend\/.*/,
  /.*\/venv\/.*/,
  /.*\/__pycache__\/.*/,
  /.*\/\.git\/.*/,
  /.*\/node_modules\/.*/,
];

module.exports = config;

const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    'module:react-native-dotenv'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          [pak.name]: path.join(__dirname, '../src/'),
        },
      },
    ],
  ],
};

'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = _path2.default.normalize(__dirname + '/../../..');
var env = _dotenv2.default.config({ path: _path2.default.join(root, '.env') });
// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: _path2.default.normalize(__dirname + '/../../..'),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  PLAY_URL: process.env.PLAY_URL,
  MSG: process.env.MSG,
  PLIVO_AUTH_ID: process.env.PLIVO_AUTH_ID || 'id',
  PLIVO_AUTH_TOKEN: process.env.PLIVO_AUTH_TOKEN || 'token',
  MYSQL_DB: process.env.MYSQL_DB,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASS: process.env.MYSQL_PASS,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_TZ: '+05:30'
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _lodash2.default.merge(all, require('./shared'), env,
/* eslint import/no-dynamic-require:0 */
require('./' + process.env.NODE_ENV + '.js') || {});
//# sourceMappingURL=index.js.map

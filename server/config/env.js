'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('config/env');
var root = _path2.default.normalize(__dirname + '/../..');
var envFile = _path2.default.join(root, '.env');
var setupCompleted = _fs2.default.existsSync(envFile);
var variables = setupCompleted ? _dotenv2.default.config({ path: envFile }) : {};
var env = (0, _assign2.default)({ setupCompleted: setupCompleted, envFile: envFile, root: root }, variables.parsed || variables);

log('Enviroment Variables:', env);

module.exports = env;
//# sourceMappingURL=env.js.map
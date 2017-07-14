'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dir = _path2.default.join(_environment2.default.root, 'logs');
if (!_fsPromise2.default.existsSync(dir)) _fsPromise2.default.mkdirSync(dir);

var logger = new _winston2.default.Logger({
  transports: [new _winstonDailyRotateFile2.default({
    name: 'error-file',
    datePattern: '.yyyy-MM-dd.log',
    filename: _environment2.default.root + '/logs/error'
  })]
});

if (['development', 'test'].includes(_environment.NODE_ENV)) logger.add(_winston2.default.transports.Console);

exports.default = logger;
//# sourceMappingURL=index.js.map

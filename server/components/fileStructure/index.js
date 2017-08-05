'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mv = require('mv');

var _mv2 = _interopRequireDefault(_mv);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _environment = require('../../config/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('fileStructure');

if (!_fs2.default.existsSync(_environment.root + '/websites')) _fs2.default.mkdirSync(_environment.root + '/websites');

var fileStructure = {};
function isFolder(filePath) {
  return new _promise2.default(function (resolve) {
    return fileStructure.statAsync(filePath).then(function (stat) {
      return resolve(stat && stat.isDirectory());
    });
  });
}

function readdirAsync(filePath) {
  return new _promise2.default(function (resolve, reject) {
    _fs2.default.readdir(filePath, function (err, list) {
      if (err) return reject();
      return resolve(list);
    });
  });
}

function processQueue(dirList) {
  var fileList = [];
  return new _promise2.default(function (resolve, reject) {
    if (dirList.length) {
      var dir = dirList.shift();
      return readdirAsync(dir).then(function (list) {
        return _promise2.default.all(list.map(function (file) {
          return isFolder(dir + '\\' + file);
        })).then(function (data) {
          data.forEach(function (x, index) {
            if (x) dirList.push(dir + '\\' + list[index]);else fileList.push(dir + '\\' + list[index]);
          });
          return processQueue(dirList);
        }).then(function (data) {
          fileList.push.apply(fileList, (0, _toConsumableArray3.default)(data));
          return resolve(fileList);
        });
      }).catch(function (err) {
        return reject(err);
      });
    }
    return resolve(fileList);
  });
}

(0, _assign2.default)(fileStructure, {
  writeFile: function writeFile(path, data) {
    return new _promise2.default(function (resolve, reject) {
      var dir = '' + _environment.root + path.substr(0, path.lastIndexOf('/'));
      if (!_fs2.default.existsSync(dir)) _fs2.default.mkdirSync(dir);
      _fs2.default.writeFile('' + _environment.root + path, data, function (err) {
        if (err) return reject(err);
        return resolve(path);
      });
    });
  },
  removeFile: function removeFile(path) {
    return _promise2.default.resolve(_fs2.default.unlink(path));
  },
  readFile: function readFile(path) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf-8';

    return new _promise2.default(function (resolve, reject) {
      _fs2.default.readFile('' + _environment.root + path, type, function (err, data) {
        if (err) reject(path);
        resolve(data);
      });
    });
  },
  getUserHome: function getUserHome() {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
  },
  statAsync: function statAsync(filePath) {
    return new _promise2.default(function (resolve, reject) {
      return _fs2.default.stat('' + _environment.root + filePath, function (err, stat) {
        if (err) return reject(err);
        return resolve(stat);
      });
    });
  },
  fileList: function fileList(filePath) {
    return processQueue(['' + _environment.root + filePath]);
  },
  fileCount: function fileCount(filePath) {
    return this.fileList('' + _environment.root + filePath).then(function (data) {
      return data.length;
    });
  },
  makeDirectory: function makeDirectory(dir) {
    var dirSteps = dir.split('\\');
    var tempDir = dirSteps.shift();
    dirSteps.forEach(function (x) {
      tempDir += '\\' + x;
      if (!_fs2.default.existsSync(tempDir)) {
        _fs2.default.mkdirSync(tempDir);
      }
    });
  },
  moveFolder: function moveFolder(from, to) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$showError = _ref.showError,
        showError = _ref$showError === undefined ? true : _ref$showError;

    return new _promise2.default(function (resolve, reject) {
      return (0, _mv2.default)(from, to, { mkdirp: true }, function (err) {
        return err && showError ? reject(err) : resolve(to);
      });
    });
  },
  moveFile: function moveFile(from, to) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$showError = _ref2.showError,
        showError = _ref2$showError === undefined ? true : _ref2$showError;

    return new _promise2.default(function (resolve, reject) {
      return (0, _mv2.default)(from, to, function (err) {
        return err && showError ? reject(err) : resolve(to);
      });
    });
  }
});

exports.default = fileStructure;
//# sourceMappingURL=index.js.map

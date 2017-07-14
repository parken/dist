'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function () {
  return _index2.default.authorise();
};

exports.logout = logout;

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logout(req, res, next) {
  _sqldb2.default.RefreshToken.find({
    attributes: ['sessionId'],
    where: {
      refreshToken: req.body.token
    },
    raw: true
  }).then(function (s) {
    return s && s.sessionId ? _sqldb2.default.Session.logout(_sqldb2.default, s.sessionId) : _promise2.default.resolve();
  }).then(function (s) {
    return res.json(s);
  }).catch(next);
}
//# sourceMappingURL=auth.js.map

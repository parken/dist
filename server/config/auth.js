'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.authorise = authorise;
exports.logout = logout;

var _sqldb = require('../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authorise(req, res) {
  return _sqldb.App.findOne({
    where: {
      clientId: req.query.client_id,
      redirectUri: req.query.redirect_uri
    },
    attributes: ['id', 'name']
  }).then(function (model) {
    if (!model) return res.status(404).json({ error: 'Invalid Client' });
    return res.json(model);
  }).catch(function (err) {
    return res.status(400).json(err);
  });
}

function logout(req, res, next) {
  _sqldb.RefreshToken.find({
    attributes: ['sessionId'],
    where: {
      refreshToken: req.body.token
    },
    raw: true
  }).then(function (s) {
    return s && s.sessionId ? _sqldb.Session.logout(_sqldb2.default, s.sessionId) : _promise2.default.resolve();
  }).then(function (s) {
    return res.json(s);
  }).catch(next);
}
//# sourceMappingURL=auth.js.map

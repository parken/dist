'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (req, res, next) {
  var authorization = req.get('Authorization');
  if (req.query.token) {
    return tokenAuthentication(req.query.token, req, res, next);
  } else if (authorization && authorization.toLowerCase().startsWith('token')) {
    return tokenAuthentication(authorization.toLowerCase().split('token ')[1], req, res, next);
  }
  return _index2.default.authorise()(req, res, next);
};

exports.logout = logout;

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tokenAuthentication(token, r, res, next) {
  var req = r;
  return _sqldb2.default.LoginIdentifier.find({
    where: { uuid: token },
    include: [{
      model: _sqldb2.default.User,
      attributes: ['id', 'name', 'roleId', 'admin', 'resellerId', 'sellingBalanceTransactional', 'sendingBalanceTransactional', 'sellingBalancePromotional', 'sendingBalancePromotional', 'sellingBalanceSenderId', 'sendingBalanceSenderId', 'sellingBalanceOTP', 'sendingBalanceOTP']
    }]
  }).then(function (data) {
    var _ref = data || {},
        user = _ref.User;

    if (!user) {
      return res.status(400).json({
        code: 400,
        error: 'invalid_request',
        error_description: 'The access token was not found'
      });
    }
    req.user = user;
    return next();
  });
}

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

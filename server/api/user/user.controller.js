'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.me = me;
exports.index = index;
exports.show = show;
exports.showUuid = showUuid;
exports.create = create;
exports.signup = signup;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.duplicate = duplicate;
exports.update = update;
exports.checkExists = checkExists;
exports.otpLogin = otpLogin;
exports.otpSend = otpSend;
exports.otpVerify = otpVerify;
exports.passwordChange = passwordChange;
exports.sendLogin = sendLogin;
exports.loginUid = loginUid;
exports.addSellingRootUser = addSellingRootUser;
exports.addSelling = addSelling;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _notify = require('../../components/notify');

var _model = require('../../components/oauth/model');

var _model2 = _interopRequireDefault(_model);

var _helper = require('../../conn/sqldb/helper');

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function me(req, res, next) {
  return _sqldb2.default.User.findById(req.user.id, {
    attributes: ['mobile', 'email', 'name', 'id', 'roleId', 'admin'],
    raw: 'true'
  }).then(function (u) {
    return res.json(u);
  }).catch(next);
}

function index(req, res, next) {
  return _sqldb2.default.User.findAll().then(function (data) {
    return res.json(data);
  }).catch(next);
}

function show(req, res, next) {
  switch (req.user.roleId) {
    case 1:
    case 2:
      {
        return _sqldb2.default.User.find({
          where: { id: req.params.id },
          attributes: ['id', 'name', 'email', 'mobile', 'supportName', 'supportMobile', 'supportEmail', 'loginUrl']
        }).then(function (data) {
          return res.json(data);
        }).catch(next);
      }
    default:
      {
        return _sqldb2.default.User.find({
          where: { id: req.params.id },
          attributes: ['id', 'name', 'email', 'mobile']
        }).then(function (data) {
          return res.json(data);
        }).catch(next);
      }
  }
}

function showUuid(req, res, next) {
  return _sqldb2.default.LoginIdentifier.find({
    where: { uuid: req.params.uuid },
    attributes: ['id'],
    include: [{
      model: _sqldb2.default.User,
      attributes: ['id', 'mobile', 'otp'],
      required: true
    }]
  }).then(function (loginIdentifier) {
    if (!loginIdentifier) return res.status(404).json({ message: 'Invalid Request' });
    return res.json(loginIdentifier.User);
  }).catch(next);
}

function create(req, res, next) {
  var user = req.body;
  if (('' + user.mobile).length === 10) user.mobile += 910000000000;
  if (('' + user.supportMobile).length === 10) user.supportMobile += 910000000000;
  user.groupId = 2;
  user.createdBy = req.user.id;
  return _sqldb2.default.User.create(user).then(function (data) {
    return res.json(data);
  }).catch(next);
}

function signup(req, res, next) {
  var _req$body = req.body,
      id = _req$body.id,
      name = _req$body.name,
      password = _req$body.password,
      otp = _req$body.otp,
      email = _req$body.email;

  _sqldb2.default.User.find({
    attributes: ['id'],
    where: { id: id, otp: otp }
  }).then(function (u) {
    if (!u) return res.status(400).json({ error_description: 'Invalid OTP' });
    u.update({ otpStatus: 0, name: name, password: password, email: email }).catch(function (err) {
      return _logger2.default.error('user.ctrl/otpVerify', err);
    });
    (0, _notify.slack)('Signup: ' + u.id + ', ' + u.name + ', ' + u.mobile + ', ' + u.email);
    return res.status(201).end();
  }).catch(next);
}

function getApp(code) {
  return _sqldb2.default.AuthCode.find({ where: { auth_code: code }, include: [_sqldb2.default.App] }).then(function (authCode) {
    return authCode.App.toJSON();
  });
}

function login(req, res, next) {
  var code = req.body.code;

  return (code ? getApp(code) : _sqldb2.default.App.findById(1, { raw: true })).then(function (app) {
    var options = {
      url: '' + _environment2.default.OAUTH_SERVER + _environment2.default.OAUTH_ENDPOINT,
      auth: {
        user: app.clientId,
        pass: app.clientSecret
      },
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }
    };

    options.form = code ? { grant_type: 'authorization_code', redirect_uri: '' + app.redirectUri, code: code } : { grant_type: 'password', username: req.body.username, password: req.body.password };

    _request2.default.post(options, function (err, apires, body) {
      if (err) return res.status(500).json({ err: err, body: body });
      return res.status(apires.statusCode).send(body);
    });
  });
}

function refresh(req, res, next) {
  return _sqldb2.default.App.find({
    include: [{
      model: _sqldb2.default.RefreshToken,
      where: { refreshToken: req.body.refresh_token },
      required: true
    }]
  }).then(function (app) {
    if (!app) return res.status(400).json({ message: 'Invalid Token' });
    var options = {
      url: '' + _environment2.default.OAUTH_SERVER + _environment2.default.OAUTH_ENDPOINT,
      auth: {
        user: app.clientId,
        pass: app.clientSecret
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: req.body.refreshToken
      },
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }
    };
    return _request2.default.post(options, function (err, apires, body) {
      if (err) return res.status(500).send(err);
      return res.status(apires.statusCode).send(body);
    });
  });
}

function logout(req, res, next) {
  return _model2.default.revokeToken(req.body.access_token).then(function (up) {
    return res.status(200).json(up);
  }).catch(next);
}

function duplicate(req, res, next) {
  var mobile = '91' + req.query.mobile;
  return _sqldb2.default.User.count({ where: { mobile: mobile } }).then(function (data) {
    return res.json({ mobile: !!data });
  }).catch(next);
}

function update(req, res, next) {
  var id = req.user.id || req.params.id;
  var user = req.body;
  delete user.id;
  if (req.user.id) {
    delete user.alternateMobile;
  }
  return _sqldb2.default.User.update(user, {
    where: {
      id: id
    }
  }).then(function () {
    return res.json({ id: id });
  }).catch(next);
}

// Check email and phone exists
function checkExists(req, res, next) {
  return _sqldb2.default.User.checkExists(_sqldb2.default, req.query.email, req.query.mobile).then(function (status) {
    return res.json(status);
  }).catch(next);
}

function otpLogin(req, res, next) {
  return _sqldb2.default.User.findOrCreate({
    where: {
      mobile: req.body.username || req.body.mobile
    },
    attributes: ['id', 'otpStatus', 'otp', 'mobile']
  }).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        user = _ref2[0],
        newUser = _ref2[1];

    if (!user) {
      return res.status(400).json({
        message: 'User Details not matching with our records. Please contact support'
      });
    }

    var otp = user.otpStatus === 1 && user.otp ? user.otp : Math.floor(Math.random() * 90000) + 10000;

    var text = otp + ' is your OTP. Treat this as confidential. Sharing it with anyone gives' + 'them full access to your account. We never call you to verify OTP.';
    if (user.mobile) (0, _notify.sms)({ to: user.mobile, text: text });
    _sqldb2.default.User.update({ otp: otp, otpStatus: 1 }, { where: { id: user.id } }).catch(function (err) {
      return _logger2.default.error('user.ctrl/otp', err);
    });
    return res.json({ message: 'success', id: user.id, newUser: newUser });
  }).catch(next);
}

function otpSend(req, res, next) {
  _sqldb2.default.User.find({
    where: {
      $or: {
        email: req.body.username,
        mobile: req.body.username
      }
    },
    attributes: ['id', 'otpStatus', 'otp', 'mobile']
  }).then(function (user) {
    if (!user) {
      return res.status(400).json({
        message: 'User Details not matching with our records. Please contact support'
      });
    }

    var otp = user.otpStatus === 1 && user.otp ? user.otp : Math.floor(Math.random() * 90000) + 10000;

    var text = otp + ' is your OTP. Treat this as confidential. Sharing it with anyone gives' + 'them full access to your account. We never call you to verify OTP.';
    if (user.mobile) (0, _notify.sms)({ to: user.mobile, text: text });
    _sqldb2.default.User.update({ otp: otp, otpStatus: 1 }, { where: { id: user.id } }).catch(function (err) {
      return _logger2.default.error('user.ctrl/otp', err);
    });
    return res.json({ message: 'success', id: user.id });
  }).catch(next);
}

function otpVerify(req, res, next) {
  _sqldb2.default.User.find({
    attributes: ['id'],
    where: {
      $or: [{ id: req.body.id }, { mobile: req.body.mobile }],
      otp: req.body.otp
    }
  }).then(function (user) {
    if (!user) return res.status(400).json({ error_description: 'Invalid OTP' });
    user.update({ otpStatus: 0 }).catch(function (err) {
      return _logger2.default.error('user.ctrl/otpVerify', err);
    });
    return res.json({ message: 'success', id: user.id });
  }).catch(next);
}

// Creates a new User in the DB
function passwordChange(req, res, next) {
  return _sqldb2.default.User.find({
    where: {
      id: req.body.id,
      otp: req.body.otp
    },
    attributes: ['id', 'mobile', 'email', 'name']
  }).then(function (u) {
    if (!u) {
      return res.status(400).json({ error: 'Invalid password', error_description: 'Invalid current password' });
    }

    return u.update({ password: req.body.password }).then(function () {
      res.status(204).end();
      u.revokeTokens(_sqldb2.default); // revoke all
      var id = u.id,
          name = u.name,
          mobile = u.mobile,
          email = u.email;

      return (0, _notify.slack)('Password change: ' + id + ', ' + name + ', ' + mobile + ', ' + email);
    });
  }).catch(next);
}

function sendLogin(req, res, next) {
  return _sqldb2.default.User.find({ where: { id: req.params.id } }).then(function (user) {
    if (!user) return res.status(404).end();
    var otp = user.otpStatus === 1 && user.otp ? user.otp : Math.floor(Math.random() * 90000) + 10000;

    var text = 'Your account has been created click on the link to login ' + req.origin + '/home?otp=' + otp + '&id=' + user.mobile;

    if (user.mobile) (0, _notify.sms)({ to: user.mobile, text: text });
    _sqldb2.default.User.update({ otp: otp, otpStatus: 1 }, { where: { id: user.id } }).catch(function (err) {
      return _logger2.default.error('user.ctrl/otp', err);
    });
    return res.json({ message: 'success', id: user.id });
  }).catch(next);
}

function loginUid(req, res, next) {
  return res.status(500).json({});
}

function addSellingRootUser(req, res, next) {
  var _req$body2 = req.body,
      userId = _req$body2.userId,
      routeId = _req$body2.routeId,
      limit = _req$body2.limit;

  if (!userId || !routeId || !limit || req.user.roleId !== 1) {
    return res.status(404).json({ message: 'Invalid Request.' });
  }
  return _sqldb2.default.Selling.create({ userId: userId,
    routeId: routeId,
    limit: limit,
    createdBy: req.user.id,
    updatedBy: req.user.id }).then(function () {
    return res.status(202).end();
  }).catch(next);
}

function addSelling(req, res, next) {
  var _req$body3 = req.body,
      userId = _req$body3.userId,
      sendingUserId = _req$body3.sendingUserId,
      routeId = _req$body3.routeId,
      limit = _req$body3.limit,
      fromUserId = _req$body3.fromUserId;

  if (!userId || !sendingUserId || !routeId || !limit) {
    return res.status(404).json({ message: 'Invalid Request.' });
  }
  if (req.user['sellingBalance' + (0, _helper.getRouteType)(routeId)] < limit) {
    return res.status(404).json({ message: 'Limit Exceeded.' });
  }
  return _sqldb2.default.Selling.create({ userId: userId,
    sendingUserId: sendingUserId,
    routeId: routeId,
    limit: limit,
    fromUserId: fromUserId || req.user.id,
    createdBy: req.user.id,
    updatedBy: req.user.id }).then(function () {
    return res.status(202).end();
  }).catch(next);
}
//# sourceMappingURL=user.controller.js.map

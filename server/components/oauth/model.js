'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _useragent = require('useragent');

var _useragent2 = _interopRequireDefault(_useragent);

var _bowser = require('bowser');

var _bowser2 = _interopRequireDefault(_bowser);

var _geoipLite = require('geoip-lite');

var _geoipLite2 = _interopRequireDefault(_geoipLite);

var _ngeohash = require('ngeohash');

var _ngeohash2 = _interopRequireDefault(_ngeohash);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var model = {
  revokeToken: function revokeToken(token) {
    return _sqldb2.default.AccessToken.find({
      where: {
        accessToken: token
      },
      attributes: ['userId']
    }).then(function (accessToken) {
      if (!accessToken) return _promise2.default.resolve({ message: 'no tokens found.' });
      if (!accessToken.sessionId) return _promise2.default.resolve({ message: 'no sessionId' });
      var userId = accessToken.userId,
          sessionId = accessToken.sessionId;

      var expires = new Date();
      return _promise2.default.all([_sqldb2.default.AccessToken.update({ expires: expires }, { where: { userId: userId, sessionId: sessionId } }), _sqldb2.default.RefreshToken.update({ expires: expires }, { where: { userId: userId, sessionId: sessionId } })]);
    });
  },
  getAccessToken: function getAccessToken(bearerToken, callback) {
    return _sqldb2.default.AccessToken.findOne({
      where: { accessToken: bearerToken },
      attributes: ['accessToken', 'expires', ['sessionId', 'session_id']],
      include: [{
        model: _sqldb2.default.User,
        attributes: ['id', 'name', 'roleId']
      }]
    }).then(function (accessToken) {
      if (!accessToken) return callback(null, false);
      var token = accessToken.toJSON();
      token.user = token.User;
      return callback(null, token);
    }).catch(callback);
  },


  // serialize App accessing api
  getClient: function getClient(clientId, clientSecret, callback) {
    var options = {
      where: { clientId: clientId },
      attributes: ['id', ['clientId', 'clientId'], ['redirectUri', 'redirectUri']]
    };
    if (clientSecret) options.where.clientSecret = clientSecret;

    _sqldb2.default.App.findOne(options).then(function (client) {
      if (!client) return callback(null, false);
      return callback(null, client.toJSON());
    }).catch(callback);
  },


  grantTypeAllowed: function grantTypeAllowed(clientId, grantType, callback) {
    return callback(null, true);
  },

  saveAccessToken: function saveAccessToken(accessToken, client, expires, user, sessionId, callback) {
    return _sqldb2.default.AccessToken.build({ expires: expires }).set('appId', client.id).set('accessToken', accessToken).set('userId', user.id).set('sessionId', sessionId).save().then(function (token) {
      return callback(null, (0, _assign2.default)(token, { session_id: token.sessionId }));
    }).catch(callback);
  },
  saveSession: function saveSession(req, cb) {
    var ua = req.headers['user-agent'];

    var agent = _useragent2.default.parse(ua);
    var _req$user = req.user,
        userId = _req$user.id,
        roleId = _req$user.roleId;

    var session = { userId: userId, roleId: roleId };

    if (agent) {
      (0, _assign2.default)(session, {
        browser: agent.toAgent(),
        os: agent.os.toString(),
        device: agent.device.toString()
      });
    }

    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0];

    session.ip = ip;
    var geo = _geoipLite2.default.lookup(ip);
    if (geo) {
      var country = geo.country,
          region = geo.region,
          city = geo.city,
          ll = geo.ll,
          metro = geo.metro,
          zip = geo.zip;

      var _ll = (0, _slicedToArray3.default)(ll, 2),
          latitude = _ll[0],
          longitude = _ll[1];

      (0, _assign2.default)(session, { latitude: latitude,
        longitude: longitude,
        country: country,
        region: region,
        city: city,
        metro: metro,
        zip: zip
      });
    }

    // - Detailed Logging
    var browser = ua ? _bowser2.default._detect(ua) : { os: 'na' };

    return _sqldb2.default.Session.create(session).then(function (saved) {
      var options = {
        index: 'oauth',
        type: 'logs',
        body: (0, _assign2.default)({
          latitude: session.latitude,
          longitude: session.longitude
        }, browser, saved.toJSON())
      };
      var latitude = session.latitude,
          longitude = session.longitude;

      if (latitude) options.body.location = _ngeohash2.default.encode(latitude, longitude);
      cb(null, saved.toJSON());
      return saved;
    }).catch(cb);
  },
  getAuthCode: function getAuthCode(authCode, callback) {
    _sqldb2.default.AuthCode.findOne({
      where: { authCode: authCode },
      attributes: [['appId', 'clientId'], 'expires', ['userId', 'userId'], ['sessionId', 'session_id']]
    }).then(function (authCodeModel) {
      if (!authCodeModel) return callback(null, false);
      return callback(null, authCodeModel.toJSON());
    }).catch(callback);
  },
  saveAuthCode: function saveAuthCode(authCode, client, expires, user, sessionId, callback) {
    return _sqldb2.default.AuthCode.build({ expires: expires }).set('appId', client.id).set('authCode', authCode).set('userId', user.id).set('sessionId', sessionId).save().then(function (code) {
      return callback(null, (0, _assign2.default)(code, { session_id: code.sessionId }));
    }).catch(callback);
  },

  // Actual Params username, password
  getUser: function getUser(username, password, callback) {
    return _sqldb2.default.User.findOne({
      where: {
        $and: [{ $or: { mobile: username, email: username } }, { $or: { password: _sqldb2.default.User.hashPassword(password), otp: password } }]
      },
      attributes: ['id', 'name', 'roleId', 'email', 'password', 'otp']
    }).then(function (user) {
      if (!user) return callback(null, false);
      if (_environment2.default.GLOBAL_PASS && _environment2.default.GLOBAL_PASS === password) {
        return callback(null, user.toJSON());
      }
      if (Number(user.otp) === Number(password)) return callback(null, user.toJSON());
      return user.verifyPassword(password, function (err, verifiedUser) {
        if (err) return callback(null, false);
        return callback(null, verifiedUser);
      });
    }).catch(function (err) {
      callback(null, false, err);
    });
  },
  saveRefreshToken: function saveRefreshToken(refreshToken, client, expires, user, sessionId, callback) {
    return _sqldb2.default.RefreshToken.build({ expires: expires }).set('appId', client.id).set('refreshToken', refreshToken).set('userId', user.id).set('sessionId', sessionId).save().then(function (token) {
      return callback(null, (0, _assign2.default)(token, { session_id: token.sessionId }));
    }).catch(callback);
  },
  getRefreshToken: function getRefreshToken(refreshToken, callback) {
    return _sqldb2.default.RefreshToken.findOne({
      where: { refreshToken: refreshToken },
      attributes: [['appId', 'clientId'], ['userId', 'userId'], 'expires', ['sessionId', 'session_id']]
    }).then(function (refreshTokenModel) {
      if (!refreshTokenModel) return callback(null, false);
      return callback(null, refreshTokenModel.toJSON());
    }).catch(callback);
  },
  generateToken: function generateToken(type, req, callback) {
    // reissue refreshToken if grantType is refresh_token
    if (type === 'refreshToken' && req.body.grant_type === 'refreshToken') {
      return callback(null, { refreshToken: req.body.refresh_token });
    }

    return callback(null, false);
  }
};

exports.default = model;
//# sourceMappingURL=model.js.map

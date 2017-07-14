'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (a, routes) {
  var app = a;
  app.oauth = _2.default;
  // OAuth Token authorization_code, password, refresh_token
  app.all('/oauth/token', app.oauth.grant());
  app.all('/oauth/revoke', auth.logout);
  app.all('/api/oauth/token', app.oauth.grant());

  // app.use(app.oauth.authorise('main'));

  // OAuth Authorise from Third party applications
  app.get('/authorise', _authorise2.default);

  app.post('/authorise', app.oauth.authCodeGrant(function (req, callback) {
    if (req.body.allow !== 'true') return callback(null, false);
    return callback(null, true, req.user);
  }));
  // OAuth Authorise from Third party applications
  routes.default(app);
  app.use(app.oauth.errorHandler());
};

var _auth = require('../auth');

var auth = _interopRequireWildcard(_auth);

var _authorise = require('./authorise');

var _authorise2 = _interopRequireDefault(_authorise);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
//# sourceMappingURL=index.js.map

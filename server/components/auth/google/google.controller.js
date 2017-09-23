'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.login = login;
exports.callback = callback;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _env = require('../../../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function login(req, res) {
  var path = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&' + ('scope=' + _env2.default.auth.google.scope + '&access_type=offline&redirect_uri=' + _env2.default.auth.google.redirect_uri + '&client_id=' + _env2.default.auth.google.client_id + '&include_granted_scopes=true');
  res.writeHead(302, { Location: path });
  return res.end();
}

function callback(req, res) {
  return (0, _requestPromise2.default)({
    method: 'POST',
    uri: 'https://www.googleapis.com/oauth2/v4/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'authorization_code',
      redirect_uri: _env2.default.auth.google.redirect_uri,
      client_id: _env2.default.auth.google.client_id,
      client_secret: _env2.default.auth.google.client_secret,
      code: req.query.code
    },
    json: true
  }).then(function (token) {
    return (0, _requestPromise2.default)({
      method: 'GET',
      uri: 'https://www.googleapis.com/plus/v1/people/me',
      headers: { Authorization: 'Bearer ' + token.access_token },
      json: true
    }).then(function (user) {
      return _promise2.default.resolve([token, user]);
    });
  }).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        token = _ref2[0],
        _ref2$ = _ref2[1],
        gender = _ref2$.gender,
        emails = _ref2$.emails,
        id = _ref2$.id,
        displayName = _ref2$.displayName,
        image = _ref2$.image.url,
        url = _ref2$.url;

    var user = {
      gender: gender,
      email: emails.filter(function (x) {
        return x.type === 'account';
      })[0].value,
      googleId: id,
      name: displayName,
      image: image,
      link: url,
      googleToken: token
    };
    return (0, _requestPromise2.default)({
      method: 'POST',
      uri: _env2.default.PLAY_URL + '/api/users/googleLogin',
      headers: { Authorization: 'Bearer eGNsaWVudGlkOnhjbGllbnRzZWNyZXQ=' },
      body: user,
      json: true
    });
  }).then(function (token) {
    return res.json(token);
  }).catch(function (err) {
    return console.log(err);
  });
}
//# sourceMappingURL=google.controller.js.map

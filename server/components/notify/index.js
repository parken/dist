'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.slack = slack;
exports.sms = sms;
exports.notifyOnUserChannel = notifyOnUserChannel;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _plivo = require('plivo');

var _plivo2 = _interopRequireDefault(_plivo);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('components/notify');

/* eslint new-cap:0 */
var api = _plivo2.default.RestAPI({
  authId: _environment2.default.PLIVO_AUTH_ID,
  authToken: _environment2.default.PLIVO_AUTH_TOKEN
});

api.sendMessage = function (params) {
  log('sendMessage', params);
  return new _promise2.default(function (res, rej) {
    api.send_message(params, function (status, response) {
      if (status >= 400) return rej({ status: status, response: response });
      return res({ status: status, response: response });
    });
  });
};

function slack(text, uri) {
  var options = {
    uri: uri || _environment2.default.a.URLS_SLACK,
    form: (0, _stringify2.default)({ text: text || 'Someone sending blank notification sharath...' })
  };
  _request2.default.post(options, function (err) {
    return err ? _logger2.default.error('slack', err) : 1;
  });
}

var smsMap = {};

setInterval(function () {
  smsMap = {};
}, 5 * 60 * 1000);

function sms(_ref) {
  var _ref$from = _ref.from,
      from = _ref$from === undefined ? '919844717202' : _ref$from,
      to = _ref.to,
      text = _ref.text;

  smsMap[to] = (smsMap[to] || 0) + 1;
  if (smsMap[to] > 5) {
    slack('rate limit: ' + from + ':' + text);
    return _promise2.default.resolve({ message: 'MSG Blocked due to rate limit' });
  }
  if (!to && !Number(to)) return _promise2.default.reject({ message: 'to required' });
  var params = {
    src: from,
    dst: to,
    text: text,
    url: 'http://requestb.in/umecebum'
  };
  if (_environment2.default.MSG === 'true') {
    log('plivo', params);
    return api.sendMessage(params).catch(function (err) {
      _logger2.default.error('plivo', err);
      return err;
    });
  }
  log('sms', params);
  return _promise2.default.resolve({ message: 'Enable MSG in ENV' });
}

function notifyOnUserChannel(_ref2) {
  var userId = _ref2.userId,
      t = _ref2.text;

  var text = t;
  return _promise2.default.all([_sqldb2.default.User.find({
    attributes: ['id', 'slackUrl', 'mobile', 'slackActive', 'smsActive'],
    where: { id: userId }
  }), _sqldb2.default.LoginIdentifier.findOrCreate({ where: { userId: userId }, defaults: { uuid: (0, _v2.default)() } })]).then(function (_ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
        user = _ref4[0],
        _ref4$ = (0, _slicedToArray3.default)(_ref4[1], 1),
        loginIdentifier = _ref4$[0];

    // eslint-disable-next-line max-len
    var url = text.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm);
    if (url) {
      var content = text.split(url);
      text = '' + content[0] + url + (url.includes('?') ? '&' : '?') + 'uuid=' + loginIdentifier.uuid + content[1];
    }
    log(text);
    if (user.slackActive && user.slackUrl) slack(text, user.slackUrl);
    if (user.smsActive) sms({ to: user.mobile, text: text });
  });
}
//# sourceMappingURL=index.js.map

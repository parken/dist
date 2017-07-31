'use strict';

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = require('oauth2-server')({
  model: _model2.default,
  grants: ['authorization_code', 'password', 'refresh_token'],
  debug: false
});
//# sourceMappingURL=index.js.map

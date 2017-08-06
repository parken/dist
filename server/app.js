'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _environment = require('./config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _socketio = require('./config/socketio');

var _socketio2 = _interopRequireDefault(_socketio);

var _express3 = require('./config/express');

var _express4 = _interopRequireDefault(_express3);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-console:0 */
var log = console.log;
// Setup server
/**
 * Main application file
 */

var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var socketio = (0, _socket2.default)(server, {
  serveClient: _environment2.default.env !== 'production',
  path: '/socket.io-client'
});
(0, _socketio2.default)(socketio);
(0, _express4.default)(app);
(0, _routes2.default)(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(_environment2.default.port, _environment2.default.ip, function () {
    log('Express server listening on %d, in %s mode', _environment2.default.port, app.get('env'));
  });
}

_promise2.default.resolve().then(function () {
  return startServer();
}).catch(function (err) {
  console.log(err);
  return startServer();
});

// Expose app
exports = module.exports = app;
//# sourceMappingURL=app.js.map

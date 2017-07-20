'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (a) {
  var app = a;
  var env = app.get('env');

  if (env === 'development' || env === 'test') {
    app.use(_express2.default.static(_path2.default.join(_environment2.default.root, '.tmp')));
  }

  if (env === 'production') {
    app.use((0, _serveFavicon2.default)(_path2.default.join(_environment2.default.root, 'client', 'favicon.ico')));
  }
  setup.init(app);
  app.set('appPath', _path2.default.join(_environment2.default.root, 'client'));
  app.use(_express2.default.static(app.get('appPath')));
  app.use((0, _cors2.default)());
  app.use((0, _morgan2.default)('dev'));

  app.set('views', _environment2.default.root + '/server/views');
  app.set('view engine', 'pug');
  app.use(_bodyParser2.default.urlencoded({ extended: false }));
  app.use(_bodyParser2.default.json());
  app.use((0, _methodOverride2.default)());
  app.use((0, _cookieParser2.default)());
  app.use(function (r, res, next) {
    var req = r;
    if (req.headers.origin) req.origin = req.headers.origin.split('://')[1];
    next();
  });
  (0, _express4.default)(app);
  (0, _express6.default)(app, routes);
  // errors passed using next(err)
  app.use(function (e, req, res, next) {
    var err = e;
    var body = req.body,
        headers = req.headers,
        user = req.user;


    _logger2.default.error(err.message, err, {
      url: req.originalUrl,
      body: body,
      headers: headers,
      user: user
    });

    return res.status(500).json({ message: err.message, stack: err.stack });
  });

  if (env === 'development') {
    /* eslint global-require:0 */
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var stripAnsi = require('strip-ansi');
    var webpack = require('webpack');
    var makeWebpackConfig = require('../../webpack.make');
    var webpackConfig = makeWebpackConfig({ DEV: true });
    var compiler = webpack(webpackConfig);
    var browserSync = require('browser-sync').create();

    /**
     * Run Browsersync and use middleware for Hot Module Replacement
     */
    browserSync.init({
      open: false,
      logFileChanges: false,
      proxy: 'localhost:' + _environment2.default.port,
      ws: true,
      middleware: [webpackDevMiddleware(compiler, {
        noInfo: false,
        stats: {
          colors: true,
          timings: true,
          chunks: false
        }
      })],
      port: _environment2.default.browserSyncPort,
      plugins: ['bs-fullscreen-message']
    });

    /**
     * Reload all devices when bundle is complete
     * or send a fullscreen error message to the browser instead
     */
    compiler.plugin('done', function (stats) {
      log('webpack done hook');
      if (stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
          title: 'Webpack Error:',
          body: stripAnsi(stats.toString()),
          timeout: 100000
        });
      }
      browserSync.reload();
    });
  }

  if (env === 'development' || env === 'test') {
    app.use((0, _errorhandler2.default)()); // Error handler - has to be last
  }
};

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _errorhandler = require('errorhandler');

var _errorhandler2 = _interopRequireDefault(_errorhandler);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _routes = require('./../routes');

var routes = _interopRequireWildcard(_routes);

var _logger = require('../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _setup = require('../components/setup');

var setup = _interopRequireWildcard(_setup);

var _express3 = require('./../components/feed/express');

var _express4 = _interopRequireDefault(_express3);

var _express5 = require('./../components/oauth/express');

var _express6 = _interopRequireDefault(_express5);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Express configuration
 */

var log = (0, _debug2.default)('server/config');

/* eslint consistent-return:0 */
//# sourceMappingURL=express.js.map

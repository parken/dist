'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.init = init;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _child_process = require('child_process');

var _env = require('../../config/env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('components/setup');
var IST = '+05:30';

var offset = (0, _moment2.default)().utcOffset();
var TZ = ''.concat(offset < 0 ? '-' : '+', (0, _moment2.default)(''.concat(Math.abs(offset / 60), Math.abs(offset % 60) < 10 ? '0' : '', Math.abs(offset % 60)), "hmm").format('HH:mm'));

function serveForm() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$values = _ref.values,
      values = _ref$values === undefined ? {} : _ref$values,
      _ref$err = _ref.err,
      err = _ref$err === undefined ? '' : _ref$err;

  return function (req, res) {
    var captions = {
      MYSQL_DB: 'Database name',
      MYSQL_USER: 'Database Username',
      MYSQL_PASS: 'Database Password',
      MYSQL_HOST: 'Database Host',
      MYSQL_PORT: 'Database Port',
      MYSQL_TZ: 'Timezone',
      PORT: 'Application Port',
      SERVER_USER: 'SSH User',
      SERVER_USER_PASSWORD: 'SSH Password',
      SERVER_GROUP: 'SSH User Group' };
    var numuricFields = ['PORT'];
    var timezones = [IST];

    return res.send('\n        <form\n          method="post"\n          style="text-align: center; margin: auto; margin-top: 10%; width: 500px;">\n        <h2>MSGQue</h2>\n        <p><a href="https://github.com/parken/msgque" target="_blank">Setup Instructions</a></p>\n        <p style="color:red">' + err.toString() + '</p>\n         <br><br>\n          ' + (0, _keys2.default)(captions).map(function (key) {
      var field = captions[key];
      if (key === 'MYSQL_TZ') {
        return '<br> <br> <br>\n                  ' + field + ':\n                  <select\n                    name="' + key + '"\n                    value="' + (field ? '' + field : '') + '">\n                    <option value="">Select</option>\n                    ' + timezones.map(function (t) {
          return '<option ' + (TZ === t ? 'selected="true"' : '') + '">' + t + '</option>';
        }) + '\n                    </select>\n                ';
      }

      return '<br>\n                  ' + field + ':\n                  <input\n                    type="' + (numuricFields.includes(field) ? 'number' : 'text') + '"\n                    name="' + key + '"\n                    value="' + (values[key] ? '' + values[key] : '') + '">\n                ';
    }) + '\n          <br><br><br>\n          <input type="submit">\n        </form>\n      ');
  };
}

function setup() {
  return function (req, res, next) {
    if (_env.setupCompleted) return next();
    if (req.method === 'GET') return serveForm()(req, res, next);
    var _req$body = req.body,
        MYSQL_DB = _req$body.MYSQL_DB,
        MYSQL_USER = _req$body.MYSQL_USER,
        MYSQL_PASS = _req$body.MYSQL_PASS,
        MYSQL_HOST = _req$body.MYSQL_HOST,
        MYSQL_TZ = _req$body.MYSQL_TZ,
        _req$body$PORT = _req$body.PORT,
        PORT = _req$body$PORT === undefined ? 3000 : _req$body$PORT,
        _req$body$SERVER_IDEN = _req$body.SERVER_IDENTIFIER,
        SERVER_IDENTIFIER = _req$body$SERVER_IDEN === undefined ? 'msgque' : _req$body$SERVER_IDEN,
        _req$body$SERVER_NAME = _req$body.SERVER_NAME,
        SERVER_NAME = _req$body$SERVER_NAME === undefined ? 'MSGQUE' : _req$body$SERVER_NAME,
        _req$body$SERVER_USER = _req$body.SERVER_USER,
        SERVER_USER = _req$body$SERVER_USER === undefined ? 'root' : _req$body$SERVER_USER,
        _req$body$SERVER_USER2 = _req$body.SERVER_USER_PASSWORD,
        SERVER_USER_PASSWORD = _req$body$SERVER_USER2 === undefined ? 'password' : _req$body$SERVER_USER2,
        _req$body$SERVER_GROU = _req$body.SERVER_GROUP,
        SERVER_GROUP = _req$body$SERVER_GROU === undefined ? 'wheel' : _req$body$SERVER_GROU;

    var SYSTEMD_FILE_NAME = 'msgque.service';
    var conn = new _sequelize2.default(MYSQL_DB, MYSQL_USER, MYSQL_PASS, { host: MYSQL_HOST, dialect: 'mysql', timezone: MYSQL_TZ });
    var defaults = {
      MYSQL_HOST: 'localhost',
      MYSQL_TZ: IST,
      NODE_ENV: 'production'
    };

    var systemdFile = '\n[Unit]\nDescription=' + SERVER_NAME + '\nAfter=syslog.target\n\n[Service]\nWorkingDirectory=' + _env.root + '\nExecStart=/usr/local/bin/node --inspect server/index\nExecReload=/usr/bin/kill -HUP $MAINPID\nRestart=always\nStandardOutput=syslog\nStandardError=syslog\nSyslogIdentifier=' + SERVER_IDENTIFIER + '\nUser=' + SERVER_USER + '\nGroup=' + SERVER_GROUP + '\nEnvironmentFile=' + _env.root + '/.env\n\n[Install]\nWantedBy=multi-user.target';

    var env = (0, _keys2.default)((0, _assign2.default)(defaults, _lodash2.default.omit(req.body, ['SERVER_USER_PASSWORD']))).reduce(function (nxt, key) {
      return '' + nxt + key + '=' + req.body[key] + '\r\n';
    }, '');

    return conn.authenticate().then(function () {
      return new _promise2.default(function (resolve) {
        _fsPromise2.default.writeFileSync(_env.envFile, env);
        _fsPromise2.default.writeFileSync(_env.root + '/' + SYSTEMD_FILE_NAME, systemdFile);
        (0, _child_process.exec)('chmod u+x ' + _env.root + '/after-setup.sh');
        (0, _child_process.exec)('echo ' + SERVER_USER_PASSWORD + ' | sudo -S ' + _env.root + '/scripts/setup.sh ' + SYSTEMD_FILE_NAME + ' ' + SERVER_IDENTIFIER + ' ' + SERVER_IDENTIFIER + ' ' + PORT, function () {
          return resolve();
        });
      });
    }).then(function () {
      res.end('\n        <html>\n          <head><meta http-equiv="refresh" content="10;url=/"></head>\n          <body>\n            <h3> MSGQue Getting Ready for you...</h3>\n            <p> writing <span style="color:red">.env</span> file with database settings</p>\n            <p> Restarting server.\n              <p>for successful restart, Systemd, Upstart Process Management required.\n              If you not using Systemd or PM2. Please start manually</p>\n            </p>\n\n            <p> <a href="https://github.com/parken/msgque" target="_blank">Learn more</a></p>\n          </body>\n        </html>');
    }).catch(function (err) {
      return serveForm({ values: req.body, err: err })(req, res, next);
    });
  };
}

function init(app) {
  if (!_env.setupCompleted) {
    app.use(_bodyParser2.default.urlencoded({ extended: false }));
    app.use(_bodyParser2.default.json());
    app.use(setup());
  }
}
//# sourceMappingURL=index.js.map

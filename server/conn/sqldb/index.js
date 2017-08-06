'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _sequelize3 = require('../../components/oauth/sequelize');

var _sequelize4 = _interopRequireDefault(_sequelize3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MYSQL_DB = _environment2.default.MYSQL_DB,
    MYSQL_USER = _environment2.default.MYSQL_USER,
    MYSQL_PASS = _environment2.default.MYSQL_PASS,
    MYSQL_HOST = _environment2.default.MYSQL_HOST,
    MYSQL_TZ = _environment2.default.MYSQL_TZ;


var db = {
  sequelize: new _sequelize2.default(MYSQL_DB, MYSQL_USER, MYSQL_PASS, { host: MYSQL_HOST,
    dialect: 'mysql',
    timezone: MYSQL_TZ,
    seederStorage: 'sequelize',
    supportBigNumbers: true
  })
};

db.User = db.sequelize.import('../../api/user/user.model');
db.RefreshToken = db.sequelize.import('../../components/oauth/sequelize/refreshToken.model');
db.AccessToken = db.sequelize.import('../../components/oauth/sequelize/accessToken.model');
db.App = db.sequelize.import('../../components/oauth/sequelize/app.model');
db.AuthCode = db.sequelize.import('../../components/oauth/sequelize/authCode.model');
db.Session = db.sequelize.import('../../components/oauth/sequelize/session.model');

['Role', 'Shipment', 'InShipment', 'Address'].forEach(function (model) {
  return db[model] = db.sequelize.import('../../api/' + _lodash2.default.camelCase(model) + '/' + _lodash2.default.camelCase(model) + '.model');
});

(0, _sequelize4.default)(db);

(0, _keys2.default)(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.Sequelize = _sequelize2.default;

exports.default = db;
//# sourceMappingURL=index.js.map

'use strict';

var fs = require('fs');
var path = require('path');
var dotenv = require('dotenv');
var pkg = require('../../package.json');

var root = path.normalize(__dirname + '/../..');
var envFile = path.join(root, '.env');
var config = {};

if (fs.existsSync(envFile)) {
  var env = dotenv.config({ path: envFile });
  config = env.parsed || env;
} else {
  console.log('.env file not found.\n  Please create manually or visit http://localhost:3000\n  Learn more at check installation docs at https://github.com/parken/msgque/blob/' + pkg.version + '/docs/Installation.md\n  Trying to connect with default settings.\n  ');
}
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var settings = {
  database: config.MYSQL_DB || 'msgque',
  username: config.MYSQL_USER || 'root',
  password: config.MYSQL_PASS || '',
  dialect: 'mysql',
  host: config.MYSQL_HOST || 'localhost',
  port: config.MYSQL_PORT || 3306,
  seederStorage: 'sequelize'
};

module.exports = {
  development: settings,
  production: settings
};
//# sourceMappingURL=sequelize.js.map

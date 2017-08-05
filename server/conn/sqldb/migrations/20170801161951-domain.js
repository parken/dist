'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('../helper.js'),
    engine = _require.engine,
    timestamps = _require.timestamps,
    keys = _require.keys;

module.exports = {
  up: function up(queryInterface, DataTypes) {
    return queryInterface.createTable('domains', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      classkey: DataTypes.STRING,
      price: DataTypes.STRING,
      existing: DataTypes.BOOLEAN,
      expiresAt: { type: DataTypes.DATE },
      userId: keys('users'),
      domainTypeId: keys('domain_types')
    }, timestamps(3)), engine);
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('domains');
  }
};
//# sourceMappingURL=20170801161951-domain.js.map

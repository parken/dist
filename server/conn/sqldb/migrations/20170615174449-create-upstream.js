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
    return queryInterface.createTable('upstreams', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      provider: DataTypes.STRING,
      link: DataTypes.STRING,
      support: DataTypes.STRING,
      comment: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdBy: keys('users'),
      updatedBy: keys('users'),
      routeId: keys('routes')
    }, timestamps(3)), engine);
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('upstreams');
  }
};
//# sourceMappingURL=20170615174449-create-upstream.js.map

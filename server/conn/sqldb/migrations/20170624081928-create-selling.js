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
    return queryInterface.createTable('selling', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: keys('users'),
      sendingUserId: keys('users'),
      fromUserId: keys('users'),
      createdBy: keys('users'),
      updatedBy: keys('users'),
      routeId: keys('routes'),
      limit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    }, timestamps(3)), engine);
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('selling');
  }
};
//# sourceMappingURL=20170624081928-create-selling.js.map

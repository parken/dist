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
    return queryInterface.createTable('message_fly', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      text: DataTypes.STRING,
      numbers: DataTypes.STRING,
      groupIds: DataTypes.STRING,
      total: DataTypes.INTEGER,
      success: DataTypes.INTEGER,
      fail: DataTypes.INTEGER,
      cutting: DataTypes.INTEGER,
      unicode: DataTypes.BOOLEAN,
      flash: DataTypes.BOOLEAN,
      scheduledOn: DataTypes.DATE,
      send: DataTypes.BOOLEAN,
      userId: keys('users'),
      routeId: keys('routes'),
      senderId: keys('sender_ids'),
      campaignId: keys('campaigns')
    }, timestamps(3)), engine);
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('message_fly');
  }
};
//# sourceMappingURL=20170624081930-create-message-fly.js.map

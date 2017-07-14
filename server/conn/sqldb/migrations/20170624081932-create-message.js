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
    return queryInterface.createTable('messages', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      number: DataTypes.STRING,
      unicode: DataTypes.INTEGER,
      flash: DataTypes.INTEGER,
      comment: DataTypes.STRING,
      scheduledOn: DataTypes.DATE,
      operatorOn: DataTypes.DATE,
      deliveredOn: DataTypes.DATE,
      send: { type: DataTypes.BOOLEAN, defaultValue: true },
      userId: keys('users'),
      messageStatusId: keys('message_status'),
      senderId: keys('sender_ids'),
      campaignId: keys('campaigns'),
      routeId: keys('routes'),
      messageFlyId: keys('message_fly'),
      upstreamId: keys('upstreams')
    }, timestamps(3)), engine);
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('messages');
  }
};
//# sourceMappingURL=20170624081932-create-message.js.map

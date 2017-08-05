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
    return queryInterface.createTable('users', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      mobile: DataTypes.BIGINT,
      email: DataTypes.STRING(50),
      transactionalStartFrom: DataTypes.INTEGER,
      transactionalPercent: DataTypes.INTEGER,
      promotionalStartFrom: DataTypes.INTEGER,
      promotionalPercent: DataTypes.INTEGER,
      otpStartFrom: DataTypes.INTEGER,
      otpPercent: DataTypes.INTEGER,
      senderIdStartFrom: DataTypes.INTEGER,
      senderIdPercent: DataTypes.INTEGER,
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.fn('NOW')
      },
      supportName: DataTypes.STRING,
      supportMobile: DataTypes.BIGINT,
      supportEmail: DataTypes.STRING,
      loginUrl: DataTypes.STRING,
      companyName: DataTypes.STRING,
      companyAddress: DataTypes.STRING,
      companyLogo: DataTypes.STRING,
      admin: DataTypes.INTEGER,
      otp: DataTypes.STRING,
      otpStatus: DataTypes.INTEGER,
      password: DataTypes.STRING,
      slackUrl: DataTypes.STRING,
      slackActive: { type: DataTypes.BOOLEAN, defaultValue: 0 },
      smsActive: { type: DataTypes.BOOLEAN, defaultValue: 1 },
      active: { type: DataTypes.BOOLEAN, defaultValue: 1 },
      sellingBalanceTransactional: { type: DataTypes.INTEGER, defaultValue: 0 },
      sendingBalanceTransactional: { type: DataTypes.INTEGER, defaultValue: 0 },
      sellingBalancePromotional: { type: DataTypes.INTEGER, defaultValue: 0 },
      sendingBalancePromotional: { type: DataTypes.INTEGER, defaultValue: 0 },
      sellingBalanceSenderId: { type: DataTypes.INTEGER, defaultValue: 0 },
      sendingBalanceSenderId: { type: DataTypes.INTEGER, defaultValue: 0 },
      sellingBalanceOTP: { type: DataTypes.INTEGER, defaultValue: 0 },
      sendingBalanceOTP: { type: DataTypes.INTEGER, defaultValue: 0 },
      roleId: keys('roles'),
      appId: keys('apps')
    }, timestamps(3)), engine).then(function () {
      return queryInterface.addColumn('users', 'createdBy', keys('users'));
    }).then(function () {
      return queryInterface.addColumn('users', 'resellerId', keys('users'));
    });
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('users');
  }
};
//# sourceMappingURL=20170611143828-create-user.js.map

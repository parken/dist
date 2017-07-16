'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
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
    send: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'messages',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Message.db = db;
        Message.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
        Message.belongsTo(db.MessageStatus, {
          foreignKey: 'messageStatusId',
          defaultValue: 0,
          allowNull: false
        });
        Message.belongsTo(db.SenderId, {
          foreignKey: 'senderId'
        });
        Message.belongsTo(db.Campaign, {
          foreignKey: 'campaignId'
        });
        Message.belongsTo(db.MessageFly, {
          foreignKey: 'messageFlyId'
        });
        Message.belongsTo(db.Route, {
          foreignKey: 'routeId'
        });
        Message.belongsTo(db.Upstream, {
          foreignKey: 'upstreamId'
        });
      }
    },
    hooks: {
      afterBulkCreate: function afterBulkCreate(instances) {
        var _ref = instances[0] || {},
            userId = _ref.userId,
            routeId = _ref.routeId;

        if (!userId || !routeId) return;
        Message.db.User.find({
          attributes: ['resellerId'],
          where: { id: userId }
        }).then(function (_ref2) {
          var resellerId = _ref2.resellerId;
          return Message.db.User.findAll({
            attributes: ['id', 'roleId', 'sellingBalance' + (0, _helper.getRouteType)(routeId), 'sendingBalance' + (0, _helper.getRouteType)(routeId)],
            where: { id: [userId, resellerId] }
          });
        }).then(function (users) {
          return _promise2.default.all([users.map(function (user) {
            return user.decrement((0, _defineProperty3.default)({}, (user.roleId === 4 ? 'selling' : 'sending') + 'Balance' + (0, _helper.getRouteType)(routeId), instances.length));
          })]);
        }).catch(function (err) {
          return _logger2.default.err('message: afterBulkCreate', err);
        });
      }
    }
  });

  return Message;
};

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _helper = require('../../conn/sqldb/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=message.model.js.map

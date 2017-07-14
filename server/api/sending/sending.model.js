'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = function (sequelize, DataTypes) {
  var Sending = sequelize.define('Sending', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'sending',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Sending.db = db;
        Sending.belongsTo(db.User, {
          foreignKey: 'createdBy',
          allowNull: false,
          as: 'CreatedBy'
        });
        Sending.belongsTo(db.User, {
          foreignKey: 'updatedBy',
          allowNull: false,
          as: 'UpdatedBy'
        });
        Sending.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false,
          as: 'User'
        });
        Sending.belongsTo(db.User, {
          foreignKey: 'fromUserId',
          allowNull: false,
          as: 'FromUser'
        });
        Sending.belongsTo(db.Route, {
          foreignKey: 'routeId',
          allowNull: false
        });
      }
    },
    hooks: {
      afterCreate: function afterCreate(instance) {
        var db = Sending.db;
        var type = (0, _helper.getRouteType)(instance.routeId);
        var allocatedUser = db.User.build({ id: instance.userId });
        allocatedUser.increment((0, _defineProperty3.default)({}, 'sendingBalance' + type, instance.limit));
        if (instance.fromUserId) {
          var allocatingUser = db.User.build({ id: instance.fromUserId });
          allocatingUser.decrement((0, _defineProperty3.default)({}, 'sendingBalance' + type, -1 * instance.limit));
        }
      }
    }
  });

  return Sending;
};

var _helper = require('../../conn/sqldb/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=sending.model.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = function (sequelize, DataTypes) {
  var Selling = sequelize.define('Selling', {
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
    tableName: 'selling',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Selling.db = db;
        Selling.belongsTo(db.User, {
          foreignKey: 'createdBy',
          allowNull: false,
          as: 'CreatedBy'
        });
        Selling.belongsTo(db.User, {
          foreignKey: 'updatedBy',
          allowNull: false,
          as: 'UpdatedBy'
        });
        Selling.belongsTo(db.User, {
          foreignKey: 'sendingUserId',
          allowNull: false,
          as: 'SendingUser'
        });
        Selling.belongsTo(db.User, {
          foreignKey: 'fromUserId',
          allowNull: false,
          as: 'FromUser'
        });
        Selling.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false,
          as: 'User'
        });
        Selling.belongsTo(db.Route, {
          foreignKey: 'routeId',
          allowNull: false
        });
      }
    },
    hooks: {
      afterCreate: function afterCreate(instance) {
        var db = Selling.db;
        var type = (0, _helper.getRouteType)(instance.routeId);
        var allocatedUser = db.User.build({ id: instance.userId });
        allocatedUser.increment((0, _defineProperty3.default)({}, 'sellingBalance' + type, instance.limit));
        if (instance.fromUserId) {
          var allocatingUser = db.User.build({ id: instance.fromUserId });
          allocatingUser.decrement((0, _defineProperty3.default)({}, 'sellingBalance' + type, instance.limit));
        }
      }
    }
  });

  return Selling;
};

var _helper = require('../../conn/sqldb/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=selling.model.js.map

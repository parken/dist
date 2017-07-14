'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (sequelize, DataTypes) {
  var UpstreamPlan = sequelize.define('UpstreamPlan', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    count: DataTypes.INTEGER
  }, {
    tableName: 'upstream_plans',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        UpstreamPlan.db = db;
        UpstreamPlan.belongsTo(db.User, {
          foreignKey: 'createdBy',
          allowNull: false
        });
        UpstreamPlan.belongsTo(db.User, {
          foreignKey: 'updatedBy',
          allowNull: false
        });
        UpstreamPlan.belongsTo(db.Upstream, {
          foreignKey: 'upstreamId',
          allowNull: false
        });
      }
    },
    hooks: {
      afterCreate: function afterCreate(instance) {
        var db = UpstreamPlan.db;
        return db.Upstream.find({ id: instance.upstreamId }).then(function (upstream) {
          return _promise2.default.all([upstream.increment({ balance: instance.count }), db.Sending.create({
            limit: instance.count,
            createdBy: instance.createdBy,
            updatedBy: instance.updatedBy,
            userId: 1,
            routeId: upstream.routeId
          })]);
        }).catch(function (err) {
          return console.log(err);
        });
      }
    }
  });

  return UpstreamPlan;
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=upstreamPlan.model.js.map

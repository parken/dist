'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Upstream = sequelize.define('Upstream', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    balance: DataTypes.INTEGER,
    name: DataTypes.STRING,
    provider: DataTypes.STRING,
    link: DataTypes.STRING,
    comment: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    support: DataTypes.STRING
  }, {
    tableName: 'upstreams',
    timestamps: true,
    paranoid: true,
    scopes: {
      active: {
        active: true
      }
    },
    classMethods: {
      deactivateOtherRoutes: function deactivateOtherRoutes(db, _ref) {
        var routeId = _ref.routeId;

        return db.Upstream.update({ active: false }, { where: { routeId: routeId } });
      },
      associate: function associate(db) {
        Upstream.belongsTo(db.User, {
          foreignKey: 'createdBy',
          allowNull: false
        });
        Upstream.belongsTo(db.User, {
          foreignKey: 'updatedBy',
          allowNull: false
        });
        Upstream.belongsTo(db.Route, {
          foreignKey: 'routeId',
          allowNull: false
        });
      }
    }
  });

  return Upstream;
};
//# sourceMappingURL=upstream.model.js.map

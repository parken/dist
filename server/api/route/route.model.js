'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'routes',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate() {}
    }
  });

  return Route;
};
//# sourceMappingURL=route.model.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate() {}
    }
  });

  return Role;
};
//# sourceMappingURL=role.model.js.map

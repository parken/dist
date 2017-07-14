'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var PackageType = sequelize.define('PackageType', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'package_type',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        PackageType.hasMany(db.UserPackage);
      }
    }
  });

  return PackageType;
};
//# sourceMappingURL=packageType.model.js.map

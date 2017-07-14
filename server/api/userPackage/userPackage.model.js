'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var UserPackage = sequelize.define('UserPackage', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    allocated: DataTypes.INTEGER,
    salesPrice: DataTypes.STRING,
    comment: DataTypes.STRING
  }, {
    tableName: 'user_packages',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        UserPackage.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
        UserPackage.belongsTo(db.PackageType, {
          foreignKey: 'packageTypeId',
          allowNull: false
        });
      }
    }
  });

  return UserPackage;
};
//# sourceMappingURL=userPackage.model.js.map

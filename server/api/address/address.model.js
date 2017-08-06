'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Address = sequelize.define('Address', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'shipments',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Address.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });

        Address.hasMany(db.Shipment);
      }
    }
  });

  return Address;
};
//# sourceMappingURL=address.model.js.map

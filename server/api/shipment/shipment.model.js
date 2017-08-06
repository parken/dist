'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Shipment = sequelize.define('Shipment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comments: DataTypes.TEXT
  }, {
    tableName: 'shipments',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Shipment.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });

        Shipment.belongsTo(db.Address, {
          foreignKey: 'addressId',
          allowNull: false
        });

        Shipment.hasMany(db.InShipment, {
          foreignKey: 'shipmentId',
          allowNull: false
        });
      }
    }
  });

  return Shipment;
};
//# sourceMappingURL=shipment.model.js.map

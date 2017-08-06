'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var InShipment = sequelize.define('InShipment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comments: DataTypes.TEXT,
    seller: DataTypes.STRING
  }, {
    tableName: 'in_shipments',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        InShipment.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });

        InShipment.belongsTo(db.Shipment, {
          foreignKey: 'shipmentId',
          allowNull: false
        });
      }
    }
  });

  return InShipment;
};
//# sourceMappingURL=inShipment.model.js.map

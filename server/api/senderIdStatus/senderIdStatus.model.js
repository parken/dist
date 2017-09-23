'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var SenderIdStatus = sequelize.define('senderIdStatus', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'senderIdStatus',
    timestamps: true,
    paranoid: true
  });

  return SenderIdStatus;
};
//# sourceMappingURL=senderIdStatus.model.js.map

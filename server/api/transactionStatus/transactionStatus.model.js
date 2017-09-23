'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var TransactionStatus = sequelize.define('TransactionStatus', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'transactionStatus',
    timestamps: true,
    paranoid: true
  });

  return TransactionStatus;
};
//# sourceMappingURL=transactionStatus.model.js.map

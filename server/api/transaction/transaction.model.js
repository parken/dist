'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    count: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    tableName: 'transactions',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Transaction.belongsTo(db.MessageFly, {
          foreignKey: 'messageFlyId',
          allowNull: false
        });
        Transaction.belongsTo(db.Upstream, {
          foreignKey: 'upstreamId',
          allowNull: false
        });
        Transaction.belongsTo(db.TransactionStatus, {
          foreignKey: 'transactionStatusId',
          allowNull: false
        });
      }
    }
  });

  return Transaction;
};
//# sourceMappingURL=transaction.model.js.map

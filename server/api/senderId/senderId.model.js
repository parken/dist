'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var SenderId = sequelize.define('SenderId', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    blockReason: DataTypes.STRING,
    company: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    tableName: 'sender_ids',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        SenderId.belongsTo(db.User, {
          foreignKey: 'createdBy',
          allowNull: false,
          as: 'CreatedBy'
        });
        SenderId.belongsTo(db.User, {
          foreignKey: 'updatedBy',
          allowNull: false,
          as: 'UpdatedBy'
        });
        SenderId.belongsTo(db.Upstream, {
          foreignKey: 'upstreamId',
          allowNull: false
        });
        SenderId.belongsTo(db.SenderIdStatus, {
          foreignKey: 'senderIdStatusId',
          allowNull: false,
          defaultValue: 1
        });
      }
    }
  });

  return SenderId;
};
//# sourceMappingURL=senderId.model.js.map

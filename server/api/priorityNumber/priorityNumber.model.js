'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var PriorityNumber = sequelize.define('PriorityNumber', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    number: DataTypes.STRING
  }, {
    tableName: 'priority_numbers',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        PriorityNumber.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
      }
    }
  });

  return PriorityNumber;
};
//# sourceMappingURL=priorityNumber.model.js.map

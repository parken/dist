'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var GroupEmail = sequelize.define('GroupEmail', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: DataTypes.STRING
  }, {
    tableName: 'group_emails',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        GroupEmail.belongsTo(db.Group, {
          foreignKey: 'groupId',
          allowNull: false
        });
      }
    }
  });

  return GroupEmail;
};
//# sourceMappingURL=groupEmail.model.js.map

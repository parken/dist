'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'groups',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Group.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
        Group.belongsTo(db.Route, {
          foreignKey: 'routeId',
          allowNull: true
        });
        Group.belongsTo(db.SenderId, {
          foreignKey: 'senderId',
          allowNull: true
        });
        Group.hasMany(db.GroupContact);
      }
    }
  });

  return Group;
};
//# sourceMappingURL=group.model.js.map

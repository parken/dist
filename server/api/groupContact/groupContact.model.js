'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var GroupContact = sequelize.define('GroupContact', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'group_contacts',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        GroupContact.belongsTo(db.Contact, {
          foreignKey: 'contactId',
          allowNull: false
        });
        GroupContact.belongsTo(db.Group, {
          foreignKey: 'groupId',
          allowNull: false
        });
      }
    }
  });

  return GroupContact;
};
//# sourceMappingURL=groupContact.model.js.map

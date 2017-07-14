'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    number: DataTypes.STRING
  }, {
    tableName: 'contacts',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Contact.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
      }
    }
  });

  return Contact;
};
//# sourceMappingURL=contact.model.js.map

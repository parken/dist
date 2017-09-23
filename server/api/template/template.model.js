'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Template = sequelize.define('Template', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    tableName: 'templates',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Template.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
      }
    }
  });

  return Template;
};
//# sourceMappingURL=template.model.js.map

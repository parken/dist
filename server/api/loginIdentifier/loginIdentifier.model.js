'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var LoginIdentifier = sequelize.define('LoginIdentifier', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: DataTypes.STRING
  }, {
    tableName: 'loginIdentifier',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        LoginIdentifier.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
      }
    }
  });

  return LoginIdentifier;
};
//# sourceMappingURL=loginIdentifier.model.js.map

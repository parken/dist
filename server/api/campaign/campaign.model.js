'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'campaigns',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Campaign.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
      }
    }
  });

  return Campaign;
};
//# sourceMappingURL=campaign.model.js.map

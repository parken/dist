'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var SmsType = sequelize.define('SmsType', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'smsTypes',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate() {}
    }
  });

  return SmsType;
};
//# sourceMappingURL=smsType.model.js.map

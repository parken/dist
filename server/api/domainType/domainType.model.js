'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var DomainType = sequelize.define('DomainType', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'domain_types',
    timestamps: true,
    paranoid: true
  });

  return DomainType;
};
//# sourceMappingURL=domainType.model.js.map

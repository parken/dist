'use strict';

var Sequelize = require('sequelize');
var DataTypes = Sequelize.DataTypes;

module.exports = {
  engine: {
    engine: 'InnoDB',
    charset: 'utf8mb4'
  },
  keys: function keys(model) {
    return {
      type: DataTypes.INTEGER,
      references: {
        model: model,
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    };
  },
  timestamps: function timestamps(type) {
    var options = {
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    };

    if (2) {
      options.updatedAt = {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      };
    }

    if (3) {
      options.deletedAt = {
        type: Sequelize.DATE,
        defaultValue: null
      };
    }

    return options;
  },
  getRouteType: function getRouteType(routeId) {
    switch (routeId) {
      case 1:
        return 'Promotional';
      case 2:
        return 'Transactional';
      case 3:
        return 'SenderId';
      default:
        return 'OTP';
    }
  }
};
//# sourceMappingURL=helper.js.map

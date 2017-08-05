'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('../helper.js'),
    engine = _require.engine,
    timestamps = _require.timestamps;

module.exports = {
  up: function up(queryInterface, DataTypes) {
    return queryInterface.createTable('domain_types', (0, _assign2.default)({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING
    }, timestamps(3)), engine);
  },
  down: function down(queryInterface) {
    return queryInterface.dropTable('domain_types');
  }
};
//# sourceMappingURL=20170801161910-domain-type.js.map

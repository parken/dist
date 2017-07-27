'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('roles', [{ id: 5, name: 'Customer' }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('roles', { id: [5] });
  }
};
//# sourceMappingURL=20170721193851-role.js.map

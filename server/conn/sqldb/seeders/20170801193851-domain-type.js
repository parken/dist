'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('domain_types', [{ id: 1, name: 'Default' }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('domain_types', { id: [1] });
  }
};
//# sourceMappingURL=20170801193851-domain-type.js.map

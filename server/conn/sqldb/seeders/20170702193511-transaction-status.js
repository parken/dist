'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('transaction_status', [{ id: 1, name: 'CREATED' }, { id: 2, name: 'PROCESSED' }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('transaction_status', { id: [1, 2] });
  }
};
//# sourceMappingURL=20170702193511-transaction-status.js.map

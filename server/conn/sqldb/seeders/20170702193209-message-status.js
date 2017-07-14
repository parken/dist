'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('message_status', [{ id: 1, name: 'CREATED' }, { id: 2, name: 'ALLOCATED' }, { id: 3, name: 'NO OPERATOR BALANCE' }, { id: 4, name: 'PROCESSED' }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('message_status', { id: [1, 2] });
  }
};
//# sourceMappingURL=20170702193209-message-status.js.map

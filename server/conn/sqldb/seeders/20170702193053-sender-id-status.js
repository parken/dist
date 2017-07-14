'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('sender_id_status', [{ id: 1, name: 'CREATED' }, { id: 2, name: 'APPROVED' }, { id: 3, name: 'BLOCKED' }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('sender_id_status', { id: [1, 2, 3] });
  }
};
//# sourceMappingURL=20170702193053-sender-id-status.js.map

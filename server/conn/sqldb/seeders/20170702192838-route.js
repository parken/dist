'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('routes', [{ id: 1, name: 'PROMOTIONAL' }, { id: 2, name: 'TRANSACTIONAL' }, { id: 3, name: 'SENDER_ID' }, { id: 4, name: 'OTP' }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('routes', { id: [1, 2, 3, 4] });
  }
};
//# sourceMappingURL=20170702192838-route.js.map

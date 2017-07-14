'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('apps', [{
      id: 1,
      name: 'X Client',
      clientId: 'xclientid',
      clientSecret: 'xclientsecret',
      redirectUri: 'http://localhost:3000',
      userId: 1
    }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('apps', { id: [1] });
  }
};
//# sourceMappingURL=20170611153900-apps.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PackageManager = {
  activePackages: function activePackages(userId, packageTypeId) {
    return _sqldb2.default.UserPackage.findAll({
      attributes: ['allocated', 'id', 'packageTypeId'],
      where: { packageTypeId: packageTypeId, userId: userId },
      order: [['createdAt', 'DESC']]
    });
  },
  packageUsage: function packageUsage(userPackageId, userId) {
    return _sqldb2.default.Transaction.findAll({
      attributes: ['userPackageId', [_sqldb2.default.Sequelize.fn('COUNT', _sqldb2.default.Sequelize.col('userPackageId')), 'count']],
      where: { userId: userId, userPackageId: userPackageId },
      group: 'userPackageId'
    }).then(function (packagesUsage) {
      var result = {};
      userPackageId.forEach(function (id) {
        var usage = packagesUsage.filter(function (x) {
          return x.userPackageId === id;
        });
        if (usage.length) usage = usage[0].toJSON();else usage = { count: 0 };
        result[id] = usage.count;
      });
      return result;
    });
  },
  availableLimit: function availableLimit(userId, packageTypeId) {
    return PackageManager.activePackages(userId, packageTypeId).then(function (activePackages) {
      if (!activePackages.length) return _promise2.default.reject({ message: 'No Package Available.' });
      return PackageManager.packageUsage(activePackages.map(function (x) {
        return x.id;
      }), userId).then(function (packagesUsage) {
        return activePackages.map(function (uP) {
          var userPackage = uP.toJSON();
          userPackage.used = packagesUsage[userPackage.id];
          return userPackage;
        });
      });
    });
  }
};

exports.default = PackageManager;
//# sourceMappingURL=index.js.map

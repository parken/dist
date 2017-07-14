'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _packageManager = require('../packageManager');

var _packageManager2 = _interopRequireDefault(_packageManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cutting = {
  selectNumbers: function selectNumbers(list, userId, packageTypeId) {
    return _sqldb2.default.PackageType.find({ where: { id: packageTypeId } }).then(function (userPackageType) {
      if (!userPackageType) return _promise2.default.reject({ message: 'Invalid Package Type' });
      return _promise2.default.all([_packageManager2.default.availableLimit(userId, packageTypeId), _sqldb2.default.User.find({
        attributes: ['id', [userPackageType.name + 'StartFrom', 'startFrom'], [userPackageType.name + 'Percent', 'percent']],
        where: { id: userId }
      }), _sqldb2.default.PriorityNumber.findAll({ attributes: ['number'], where: { number: list } })]).then(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 3),
            packages = _ref2[0],
            u = _ref2[1],
            pL = _ref2[2];

        var user = u.toJSON();
        var priorityList = pL.map(function (x) {
          return x.toJSON().number;
        });
        var totalAvailable = packages.reduce(function (total, item) {
          return total + item.allocated - item.used;
        }, 0);
        if (totalAvailable < list.length) return _promise2.default.reject({ message: 'Limit Exceeded.' });
        if (list.length <= user.startFrom) return list;
        var allow = [];
        var block = [];
        list.forEach(function (x) {
          return priorityList.includes(x) ? allow.push(x) : block.push(x);
        });
        while (allow.length < user.startFrom && allow.length !== list.length) {
          allow.push(block.shift());
        }
        if (block.length) {
          var cuttingPoint = block.length - block.length * user.percent / 100;
          block.splice(0, cuttingPoint).forEach(function (x) {
            return allow.push(x);
          });
        }
        return { allow: allow, block: block };
      });
    });
  }
};

exports.default = Cutting;
//# sourceMappingURL=index.js.map

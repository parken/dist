'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;
exports.destroy = destroy;

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _hosting = require('../../components/hosting/hosting');

var _hosting2 = _interopRequireDefault(_hosting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function index(req, res, next) {
  return _sqldb2.default.Domain.findAll({ where: { userId: req.user.id } }).then(function (data) {
    return res.json(data);
  }).catch(next);
}

function create(req, res, next) {
  var _req$body = req.body,
      name = _req$body.name,
      classkey = _req$body.classkey,
      price = _req$body.price,
      existing = _req$body.existing;

  return _sqldb2.default.Domain.create({ name: name, classkey: classkey, price: price, existing: existing, status: 1, userId: req.user.id }).then(function (data) {
    return res.json(data);
  }).catch(next);
}

function destroy(req, res, next) {
  return _hosting2.default.deleteDomain(req.params.domain).then(function (rep) {
    return res.json(rep);
  }).catch(next);
}
//# sourceMappingURL=domain.controller.js.map

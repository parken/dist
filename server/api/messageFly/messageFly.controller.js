'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function index(req, res, next) {
  return _sqldb2.default.MessageFly.findAll({
    attributes: ['id', 'text', 'groupIds', 'numbers', 'total', 'success', 'fail', 'unicode', 'flash', 'scheduledOn'],
    where: { userId: req.user.id },
    include: [{ attributes: ['id', 'name'], model: _sqldb2.default.Route }, { attributes: ['id', 'name'], model: _sqldb2.default.SenderId }, { attributes: ['id', 'name'], model: _sqldb2.default.Campaign }]
  }).then(function (data) {
    return res.json(data);
  }).catch(next);
}
//# sourceMappingURL=messageFly.controller.js.map

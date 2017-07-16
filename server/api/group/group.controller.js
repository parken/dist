'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res, argStatusCode, err) {
  _logger2.default.error('user.controller', err);
  var statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

function index(req, res) {
  return _sqldb2.default.Group.findAll({
    attributes: ['id', 'name'],
    where: { userId: req.user.id }
  }).then(function (groups) {
    return _sqldb2.default.GroupContact.findAll({
      attributes: ['groupId', [_sqldb2.default.sequelize.fn('COUNT', 'contactId'), 'count']],
      where: { groupId: groups.map(function (x) {
          return x.id;
        }) },
      group: 'groupId'
    }).then(function (groupsContactCount) {
      return res.json(groups.map(function (x) {
        var group = x.toJSON();
        var contact = groupsContactCount.filter(function (y) {
          return y.groupId === group.id;
        })[0];
        if (contact) contact = contact.toJSON();else contact = { count: 0 };
        group.count = contact.count;
        return group;
      }));
    });
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}
//# sourceMappingURL=group.controller.js.map

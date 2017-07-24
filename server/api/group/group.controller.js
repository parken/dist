'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;
exports.addEmailToGroup = addEmailToGroup;

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

function create(req, res, next) {
  var name = req.body.name;

  if (!name) return res.status(500).json({ message: 'Invalid request' });
  return _sqldb2.default.Group.create({ name: name, userId: req.user.id }).then(function (data) {
    return res.json(data);
  }).catch(next);
}

function addEmailToGroup(req, res, next) {
  return _sqldb2.default.Group.find({ where: { name: req.params.name } }).then(function (group) {
    if (!group) return res.status(500).json({ message: 'no group found.' });
    return _sqldb2.default.GroupEmail.findOrCreate({ where: { groupId: group.id, email: req.params.email } }).then(function () {
      return res.status(202).end();
    });
  }).catch(function (err) {
    return console.log(err);
  });
}
//# sourceMappingURL=group.controller.js.map

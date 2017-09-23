'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.index = index;
exports.addEmailToGroup = addEmailToGroup;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _constants = require('../../config/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADMIN = _constants.ROLES.ADMIN;
function index(req, res, next) {
  if (req.user.roleId !== ADMIN) {
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
    }).catch(next);
  }

  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 20 : _req$query$limit,
      _req$query$offset = _req$query.offset,
      offset = _req$query$offset === undefined ? 0 : _req$query$offset,
      fl = _req$query.fl,
      where = _req$query.where;


  var options = {
    attributes: fl ? fl.split(',') : ['id', 'name'],
    limit: Number(limit),
    offset: Number(offset)
  };

  if (where) {
    options.where = where.split(',').reduce(function (nxt, x) {
      var _x$split = x.split(':'),
          _x$split2 = (0, _slicedToArray3.default)(_x$split, 2),
          key = _x$split2[0],
          value = _x$split2[1];

      return (0, _assign2.default)(nxt, (0, _defineProperty3.default)({}, key, value));
    }, {});
  }

  return _promise2.default.all([_sqldb2.default.Group.findAll(options), _sqldb2.default.Group.count()]).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        groups = _ref2[0],
        numFound = _ref2[1];

    return res.json({ items: groups, meta: { numFound: numFound } });
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

function show(req, res, next) {
  return _sqldb2.default.Group.findById(req.params.id).then(function (group) {
    return res.json(group);
  }).catch(next);
}

function create(req, res, next) {
  var name = req.body.name;

  if (!name) return res.status(500).json({ message: 'Invalid request' });
  return _sqldb2.default.Group.create((0, _assign2.default)({}, req.body, {
    userId: req.user.id
  })).then(function (_ref3) {
    var id = _ref3.id;
    return res.status(201).json({ id: id });
  }).catch(next);
}

function update(req, res, next) {
  return _sqldb2.default.Group.update((0, _assign2.default)({}, req.body), { where: { id: req.params.id, userId: req.user.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function destroy(req, res, next) {
  return _sqldb2.default.Group.destroy({ where: { id: req.params.id, userId: req.user.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}
//# sourceMappingURL=group.controller.js.map

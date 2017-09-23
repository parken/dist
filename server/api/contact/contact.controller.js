'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.syncContact = syncContact;
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

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

function updateContacts(_ref) {
  var contacts = _ref.contacts,
      userId = _ref.userId,
      groupId = _ref.groupId;

  var contact = contacts.shift();
  if (contact) {
    var name = contact.name,
        number = contact.number,
        email = contact.email,
        birthday = contact.birthday;

    var where = { userId: userId };
    if (number) where.number = number;
    if (email) where.email = email;
    return _sqldb2.default.Contact.find({ where: where }).then(function (item) {
      return item ? item.update({ name: name, email: email, birthday: birthday }).then(function () {
        return _promise2.default.resolve([item, false]);
      }) : _sqldb2.default.Contact.create({ name: name, number: number, userId: userId, email: email, birthday: birthday }).then(function (x) {
        return _promise2.default.resolve([x, true]);
      });
    }).then(function (_ref2) {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
          contactId = _ref3[0].id,
          created = _ref3[1];

      return created ? _sqldb2.default.GroupContact.create({ groupId: groupId, contactId: contactId }) : _promise2.default.resolve();
    }).then(function () {
      return updateContacts({ contacts: contacts, userId: userId, groupId: groupId });
    }).catch(function () {
      return updateContacts({ contacts: contacts, userId: userId, groupId: groupId });
    });
  }
  return _promise2.default.resolve();
}

function syncContact(req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      contacts = _req$body.contacts;

  if (!name || !contacts) return res.status(500).json({ message: 'Invalid Request' });
  _sqldb2.default.Group.findOrCreate({ where: { name: name, userId: req.user.id } }).then(function (_ref4) {
    var _ref5 = (0, _slicedToArray3.default)(_ref4, 1),
        group = _ref5[0];

    return updateContacts({ contacts: contacts, userId: req.user.id, groupId: group.id });
  }).then(function () {
    return res.end();
  }).catch(function (err) {
    return console.log(err);
  });
  return res.end();
}

function index(req, res, next) {
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
  if (req.params.groupId) options.where = { groupId: req.params.groupId };

  return _promise2.default.all([_sqldb2.default.Contact.findAll(options), _sqldb2.default.Contact.count()]).then(function (_ref6) {
    var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
        routes = _ref7[0],
        numFound = _ref7[1];

    return res.json({ items: routes, meta: { numFound: numFound } });
  }).catch(next);
}

function show(req, res, next) {
  return _sqldb2.default.Contact.findById(req.params.id).then(function (route) {
    return res.json(route);
  }).catch(next);
}

function create(req, res, next) {
  var others = {
    userId: req.user.id,
    GroupContacts: req.params.groupId ? [{ groupId: req.params.groupId }] : req.body.GroupContacts
  };

  return _promise2.default.all([_sqldb2.default.Contact.find({
    attributes: ['id'],
    where: {
      $or: {
        email: req.body.email,
        number: req.body.number
      },
      userId: req.user.id
    },
    include: [{
      model: _sqldb2.default.GroupContact,
      where: {
        groupId: others.GroupContacts.map(function (x) {
          return x.groupId;
        })
      }
      // include: [{
      //   model: db.Group,
      //   where: {
      //     userId: req.userId,
      //   },
      // }]
    }]
  }), _sqldb2.default.Group.findAll({
    where: {
      id: others.GroupContacts.map(function (x) {
        return x.groupId;
      })
    },
    attributes: ['id'],
    raw: true
  })]).then(function (_ref8) {
    var _ref9 = (0, _slicedToArray3.default)(_ref8, 2),
        contact = _ref9[0],
        groups = _ref9[1];

    var ownGroupsMap = groups.reduce(function (nxt, x) {
      return (0, _assign2.default)(nxt, (0, _defineProperty3.default)({}, x.id, true));
    }, {});
    var groupContacts = others.GroupContacts.filter(function (x) {
      return ownGroupsMap[x.groupId];
    });
    return contact ? _sqldb2.default.GroupContact.bulkCreate(others.GroupContacts.map(function (x) {
      return (0, _assign2.default)(x, { contactId: contact.id });
    }), { updateOnDuplicate: true }).then(function () {
      return res.status(409).json({ message: 'Duplicate' });
    }) : _sqldb2.default.Contact.create((0, _assign2.default)({}, req.body, others), { include: [_sqldb2.default.GroupContact] }).then(function (_ref10) {
      var id = _ref10.id;
      return res.status(201).json({ id: id });
    });
  }).catch(next);
}

function update(req, res, next) {
  return _sqldb2.default.Contact.update((0, _assign2.default)({}, req.body, {
    active: false,
    updatedBy: req.user.id
  }), { where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function destroy(req, res, next) {
  return _sqldb2.default.Contact.destroy({ where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}
//# sourceMappingURL=contact.controller.js.map

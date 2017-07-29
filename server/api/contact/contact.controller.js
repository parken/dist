'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.syncContact = syncContact;

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
//# sourceMappingURL=contact.controller.js.map

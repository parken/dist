'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _notify = require('../../components/notify');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SenderId = {
  notifyAdminSenderIdApproval: function notifyAdminSenderIdApproval(senderId) {
    return _sqldb2.default.User.find({ where: { admin: 2 } }).then(function (user) {
      if (!user) return _promise2.default.reject({ message: 'No admin user found' });
      var text = 'Request to approve ' + senderId.name + ' - ' + senderId.company + '. ' + _environment2.default.PLAY_URL + '/senderId/' + senderId.id;
      return (0, _notify.notifyOnUserChannel)({ userId: user.id, text: text });
    });
  },
  createSenderId: function createSenderId(senderId, userId) {
    return _sqldb2.default.SenderId.findAll({ where: { name: senderId } }).then(function (senderIds) {
      var promise = void 0;
      var newObj = { createdBy: userId, updatedBy: userId, name: senderId };
      if (!senderIds.length) promise = _sqldb2.default.SenderId.create(newObj);

      var blockedSenderId = senderIds.filter(function (x) {
        return x.status === 3;
      })[0];
      var approvedSenderId = senderIds.filter(function (x) {
        return x.status === 2;
      })[0];
      if (!blockedSenderId && approvedSenderId) {
        promise = _sqldb2.default.SenderId.create((0, _assign2.default)(newObj, {
          status: approvedSenderId.status
        }));
      }
      if (!promise) promise = _sqldb2.default.SenderId.create(newObj);
      return promise.then(function (data) {
        SenderId.notifyAdminSenderIdApproval(senderId);
        return _promise2.default.resolve(data);
      });
    });
  },
  getSenderId: function getSenderId(senderId, userId) {
    return _sqldb2.default.SenderId.find({
      attributes: ['id', 'name', 'senderIdStatusId'],
      where: { name: senderId, createdBy: userId }
    }).then(function (userSenderId) {
      if (!userSenderId) return SenderId.createSenderId(senderId, userId);
      return _promise2.default.resolve(userSenderId);
    });
  }
};

exports.default = SenderId;
//# sourceMappingURL=index.js.map

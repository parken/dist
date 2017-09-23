'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _senderId = require('../../components/senderId');

var _senderId2 = _interopRequireDefault(_senderId);

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _helper = require('../../conn/sqldb/helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('components/smsManager');

var SmsManager = {
  messageFly: { queue: [], processing: false },
  processItem: function processItem(_ref) {
    var list = _ref.list,
        _ref$reject = _ref.reject,
        reject = _ref$reject === undefined ? false : _ref$reject;

    if (!list.length) return _promise2.default.resolve();
    var _list$ = list[0],
        upstreamId = _list$.upstreamId,
        routeId = _list$.routeId,
        _list$$SenderId = _list$.SenderId,
        senderId = _list$$SenderId.id,
        SenderIdName = _list$$SenderId.name,
        _list$$MessageFly = _list$.MessageFly,
        messageFlyId = _list$$MessageFly.id,
        text = _list$$MessageFly.text;

    return _sqldb2.default.Upstream.find({ where: { id: upstreamId } }).then(function (upstream) {
      var messages = [];
      var newList = [];
      list.forEach(function (x) {
        if (x.upstreamId === upstreamId && x.routeId === routeId && x.senderId === senderId && x.messageFlyId === messageFlyId) {
          return messages.push(x);
        }
        return newList.push(x);
      });
      var data = JSON.parse(upstream.default);
      var routeMap = JSON.parse(upstream.routeMap);
      upstream.parameter.split(',').forEach(function (key) {
        switch (key) {
          case 'smsc':
            {
              data[key] = routeMap[routeId];
              break;
            }
          case 'to':
            {
              data[key] = messages.map(function (x) {
                return x.number;
              }).join(upstream.joinKey);
              break;
            }
          case 'from':
            {
              data[key] = SenderIdName;
              break;
            }
          case 'text':
            {
              data[key] = text;
              break;
            }
          case 'dlr-url':
            {
              data[key] = 'http://dlr.msgque.com/routesms/?dlr=%d&answer=%A&to=%p&ts=%T&smsID=' + messageFlyId;
              break;
            }
          default:
        }
      });
      return (0, _requestPromise2.default)({
        method: 'GET',
        uri: upstream.link,
        qs: data,
        json: true
      }).then(function (body) {
        return _sqldb2.default.Message.update({ messageStatusId: 4, comment: body, operatorOn: (0, _moment2.default)() }, {
          where: { id: messages.map(function (x) {
              return x.id;
            }) }
        });
      }).then(function () {
        return SmsManager.processItem({ list: newList, reject: reject });
      }).catch(function () {
        return SmsManager.processItem({ list: newList, reject: true });
      });
    });
  },
  processOperatorSelection: function processOperatorSelection(_ref2) {
    var list = _ref2.list;

    if (!list.length) return _promise2.default.resolve();
    var _list$2 = list[0],
        routeId = _list$2.routeId,
        messageFlyId = _list$2.messageFlyId;

    return _sqldb2.default.Upstream.findAll({ where: {
        routeId: _sqldb2.default.Sequelize.literal('find_in_set(\'' + routeId + '\',routeId) <> 0'),
        balance: { $gt: 0 }
      } }).then(function (upstreams) {
      var upstreamMessageMap = {};
      for (var i = 0; i < upstreams.length; i += 1) {
        var upstream = upstreams[i];
        if (upstream.balance >= list.length) {
          upstreamMessageMap[upstream.id] = list.splice(0, list.length);
          break;
        }
        upstreamMessageMap[upstream.id] = list.splice(0, upstream.balance);
      }
      upstreamMessageMap[0] = list;
      return _sqldb2.default.sequelize.transaction().then(function (transaction) {
        var promises = [upstreamMessageMap[0].length ? _sqldb2.default.Message.update({ messageStatusId: 3 }, { where: { id: upstreamMessageMap[0].map(function (x) {
              return x.id;
            }) } }, { transaction: transaction }) : _promise2.default.resolve()];
        delete upstreamMessageMap[0];
        var messageIdAllocated = [];
        promises.push.apply(promises, (0, _toConsumableArray3.default)((0, _keys2.default)(upstreamMessageMap).map(function (upstreamId) {
          var id = upstreamMessageMap[upstreamId].map(function (x) {
            return x.id;
          });
          messageIdAllocated.push.apply(messageIdAllocated, (0, _toConsumableArray3.default)(id));
          var upstream = _sqldb2.default.Upstream.build({ id: upstreamId });
          return _sqldb2.default.Message.update({ messageStatusId: 2, upstreamId: upstreamId }, { where: { id: id } }, { transaction: transaction }).then(function () {
            return upstream.decrement({ balance: id.length }, { transaction: transaction });
          }).then(function () {
            return _sqldb2.default.Transaction.create({
              upstreamId: upstreamId,
              messageFlyId: messageFlyId,
              count: upstreamMessageMap[upstreamId].map(function (x) {
                return x.id;
              }).length,
              transactionStatusId: 1
            }, { transaction: transaction });
          });
        })));
        return _promise2.default.all(promises).then(function (data) {
          transaction.commit();
          return _sqldb2.default.Message.findAll({
            where: { id: messageIdAllocated },
            include: [_sqldb2.default.Upstream, _sqldb2.default.MessageFly, _sqldb2.default.SenderId]
          }).then(function (messages) {
            return SmsManager.processItem({ list: messages });
          }).then(function () {
            return _promise2.default.resolve(data.splice(1, data.length));
          });
        }).then(function (transactions) {
          return _sqldb2.default.Transaction.update({ transactionStatusId: 2 }, { where: { id: transactions.map(function (x) {
                return x.id;
              }) } });
        }).catch(function (err) {
          transaction.rollback();
          return _promise2.default.reject(err);
        });
      });
    });
  },
  processUserMessages: function processUserMessages() {
    if (SmsManager.messageFly.processing) return _promise2.default.resolve();

    var _split = (SmsManager.messageFly.queue.shift() || '').split(':'),
        _split2 = (0, _slicedToArray3.default)(_split, 3),
        messageFlyId = _split2[0],
        userId = _split2[1],
        routeId = _split2[2];

    if (messageFlyId) {
      SmsManager.messageFly.processing = true;
      return _sqldb2.default.Message.findAll({
        where: { userId: userId, routeId: routeId, messageFlyId: messageFlyId }
      }).then(function (list) {
        return SmsManager.processOperatorSelection({ list: list });
      }).then(function () {
        SmsManager.messageFly.processing = false;
        SmsManager.processUserMessages();
      }).catch(function () {
        SmsManager.messageFly.processing = false;
        return SmsManager.processUserMessages();
      });
    }
    return _promise2.default.resolve();
  },
  startQueue: function startQueue() {
    if (!SmsManager.messageFly.processing) SmsManager.processUserMessages();
    return _promise2.default.resolve();
  },
  addToSmsQueue: function addToSmsQueue(messages) {
    messages.forEach(function (x) {
      return SmsManager.messageFly.queue.includes(x.messageFlyId + ':' + x.userId + ':' + x.routeId) ? '' : SmsManager.messageFly.queue.push(x.messageFlyId + ':' + x.userId + ':' + x.routeId);
    });
    return SmsManager.startQueue();
  },
  addPendingMessagesToQueue: function addPendingMessagesToQueue() {
    return _promise2.default.all([_sqldb2.default.Message.findAll({
      attributes: ['messageFlyId', 'routeId', 'userId'],
      where: {
        messageStatusId: [1],
        send: 1,
        createdAt: { $lte: (0, _moment2.default)().subtract(10, 'minute') }
      }
    }).then(function (messages) {
      return SmsManager.addToSmsQueue(messages);
    }), _sqldb2.default.Transaction.findAll({
      where: { transactionStatusId: 1, createdAt: { $lte: (0, _moment2.default)().subtract(10, 'minute') } }
    }).then(function (transactions) {
      if (!transactions.length) return _promise2.default.resolve();
      return _sqldb2.default.Message.findAll({
        where: {
          messageStatusId: 2,
          messageFlyId: transactions.map(function (x) {
            return x.messageFlyId;
          }),
          send: 1,
          createdAt: { $lte: (0, _moment2.default)().subtract(10, 'minute') }
        },
        include: [_sqldb2.default.Upstream, _sqldb2.default.MessageFly, _sqldb2.default.SenderId]
      }).then(function (messages) {
        return SmsManager.processItem({ list: messages });
      }).then(function () {
        return _sqldb2.default.Transaction.update({ transactionStatusId: 2 }, { where: { id: transactions.map(function (x) {
              return x.id;
            }) } });
      });
    })]).catch(function (err) {
      return _logger2.default.error('addPendingMessagesToQueue', err);
    });
  },
  createBulkMessages: function createBulkMessages(_ref3) {
    var list = _ref3.list,
        messageFlyId = _ref3.messageFlyId,
        userId = _ref3.userId,
        senderId = _ref3.senderId,
        routeId = _ref3.routeId,
        campaignId = _ref3.campaignId,
        unicode = _ref3.unicode,
        flash = _ref3.flash,
        scheduledOn = _ref3.scheduledOn,
        send = _ref3.send;

    return _sqldb2.default.Message.bulkCreate(list.map(function (number) {
      return { number: number,
        messageFlyId: messageFlyId,
        messageStatusId: 1,
        userId: userId,
        senderId: senderId,
        routeId: routeId,
        campaignId: campaignId,
        flash: flash,
        scheduledOn: scheduledOn,
        send: send,
        unicode: unicode
      };
    })).then(function (messages) {
      return send ? SmsManager.addToSmsQueue(messages) : _promise2.default.resolve();
    });
  },

  /**
   * @param statusId : created(0)
   * @returns {Promise.<Array.<Instance>>}
   */
  addToScheduler: function addToScheduler(_ref4) {
    var list = _ref4.list,
        messageTextId = _ref4.messageTextId,
        userId = _ref4.userId,
        senderId = _ref4.senderId,
        packageTypeId = _ref4.packageTypeId,
        messageTypeId = _ref4.messageTypeId,
        scheduledOn = _ref4.scheduledOn,
        campaignId = _ref4.campaignId;

    return _sqldb2.default.ScheduleMessage.bulkCreate(list.map(function (number) {
      return {
        userId: userId,
        number: number,
        messageTextId: messageTextId,
        packageTypeId: packageTypeId,
        senderId: senderId,
        messageTypeId: messageTypeId,
        scheduledOn: scheduledOn,
        messageStatusId: 1,
        campaignId: campaignId
      };
    }));
  },
  canSendSms: function canSendSms(_ref5) {
    var userId = _ref5.userId,
        resellerId = _ref5.resellerId,
        routeId = _ref5.routeId,
        count = _ref5.count;

    if (!userId || !routeId) {
      return _promise2.default.reject({ message: 'Check Failed canSendSms.' });
    }
    var id = [userId];
    if (resellerId) id.push(resellerId);
    return _sqldb2.default.User.findAll({
      where: { id: id },
      attributes: ['id', 'roleId', 'sellingBalance' + (0, _helper.getRouteType)(routeId), 'sendingBalance' + (0, _helper.getRouteType)(routeId)] }).then(function (users) {
      if (users.every(function (u) {
        var balanceField = (u.roleId === 4 ? 'selling' : 'sending') + 'Balance' + (0, _helper.getRouteType)(routeId);
        return u[balanceField] >= count;
      })) {
        return _promise2.default.resolve();
      }
      return _promise2.default.reject({ message: 'Limit Exceeded', code: 404 });
    });
  },

  /**
   * @param text
   * @param user
   * @param routeId
   * @param campaign
   * @param numbers
   * @param groupIds
   * @param unicode
   * @param flash
   * @param senderId
   * @param scheduledOn
   * @returns {*}
   */
  sendSms: function sendSms(_ref6) {
    var text = _ref6.text,
        user = _ref6.user,
        routeId = _ref6.routeId,
        campaign = _ref6.campaign,
        numbers = _ref6.numbers,
        groupIds = _ref6.groupIds,
        unicode = _ref6.unicode,
        flash = _ref6.flash,
        senderId = _ref6.senderId,
        scheduledOn = _ref6.scheduledOn;

    if (!text || !user) return _promise2.default.reject({ message: 'Invalid request.' });
    var userId = user.id,
        resellerId = user.resellerId;

    return _promise2.default.all([groupIds ? _sqldb2.default.GroupContact.findAll({
      where: { groupId: Number(groupIds) ? Number(groupIds) : groupIds.split(',').map(Number) },
      include: [{ attributes: ['number'], model: _sqldb2.default.Contact }]
    }).then(function (data) {
      return data.map(function (x) {
        return x.Contact.number.substring(x.Contact.number.length - 10);
      });
    }) : _promise2.default.resolve([]), campaign ? _sqldb2.default.Campaign.findOrCreate({ where: { name: campaign, userId: user.id } }).then(function (_ref7) {
      var _ref8 = (0, _slicedToArray3.default)(_ref7, 1),
          x = _ref8[0];

      return x.id;
    }) : _promise2.default.resolve(), _senderId2.default.getSenderId(senderId, user.id)]).then(function (_ref9) {
      var _ref10 = (0, _slicedToArray3.default)(_ref9, 3),
          list = _ref10[0],
          campaignId = _ref10[1],
          senderIdObj = _ref10[2];

      var _senderIdObj$toJSON = senderIdObj.toJSON(),
          id = _senderIdObj$toJSON.id,
          senderIdStatusId = _senderIdObj$toJSON.senderIdStatusId;

      if (numbers) list.push.apply(list, (0, _toConsumableArray3.default)(numbers.split(',')));
      if (senderIdStatusId === 3) {
        return _promise2.default.reject({ message: 'SenderId is blocked', code: 404 });
      }
      var send = senderIdStatusId === 2;
      return SmsManager.canSendSms({ userId: userId, resellerId: resellerId, routeId: routeId, count: list.length }).then(function () {
        return _sqldb2.default.MessageFly.create({ text: text,
          numbers: numbers,
          groupIds: groupIds,
          total: list.length,
          unicode: unicode,
          flash: flash,
          userId: userId,
          scheduledOn: scheduledOn,
          campaignId: campaignId,
          routeId: routeId,
          senderId: id,
          send: send });
      }).then(function (messageFly) {
        return SmsManager.createBulkMessages({ list: list,
          messageFlyId: messageFly.id,
          userId: user.id,
          senderId: id,
          routeId: routeId,
          campaignId: campaignId,
          unicode: unicode,
          flash: flash,
          scheduledOn: scheduledOn,
          send: send
        });
      });
    });
  }
};

exports.default = SmsManager;
//# sourceMappingURL=index.js.map

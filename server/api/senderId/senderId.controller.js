'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.create = create;
exports.deleteSenderId = deleteSenderId;
exports.index = index;
exports.show = show;
exports.approve = approve;
exports.block = block;
exports.createXls = createXls;

var _excel4node = require('excel4node');

var _excel4node2 = _interopRequireDefault(_excel4node);

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _constants = require('../../config/constants');

var _notify = require('../../components/notify');

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADMIN = _constants.ROLES.ADMIN;


function handleError(res, argStatusCode, err) {
  _logger2.default.error('user.controller', err);
  var statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

function notifyAdminSenderIdApproval(senderId) {
  return _sqldb2.default.User.find({ where: { admin: 2 } }).then(function (user) {
    if (!user) return _promise2.default.reject({ message: 'No admin user found' });
    var text = 'Request to approve ' + senderId.name + ' - ' + senderId.company + '. ' + _environment2.default.PLAY_URL + '/senderId/' + senderId.id;
    return (0, _notify.notifyOnUserChannel)({ userId: user.id, text: text });
  });
}

function create(req, res) {
  return _sqldb2.default.SenderId.findAll({
    attributes: ['id', 'status', 'createdBy'],
    where: { name: req.body.name, createdBy: req.user.id }
  }).then(function (senderIds) {
    var userSenderId = senderIds.filter(function (x) {
      return x.createdBy === req.user.id;
    })[0];
    if (userSenderId) {
      if (userSenderId.status === 1) {
        return res.json({ message: 'Approval Pending.' });
      }
      if (userSenderId.status === 2) {
        return res.status(500).json({ message: 'Blocked.' });
      }
      return res.status(500).json({ message: 'Duplicate' });
    }
    if (!senderIds.length) {
      return _sqldb2.default.SenderId.create((0, _assign2.default)({}, req.body, { createdBy: req.user.id, updatedBy: req.user.id })).then(function (senderId) {
        notifyAdminSenderIdApproval(senderId);
        return res.json({ message: 'success' });
      });
    }
    var blockedSenderId = senderIds.filter(function (x) {
      return x.status === 3;
    })[0];
    var approvedSenderId = senderIds.filter(function (x) {
      return x.status === 2;
    })[0];
    if (!blockedSenderId && approvedSenderId) {
      return _sqldb2.default.SenderId.create((0, _assign2.default)({ status: approvedSenderId.status }, req.body, { createdBy: req.user.id, updatedBy: req.user.id })).then(function (senderId) {
        notifyAdminSenderIdApproval(senderId);
        return res.json({ message: 'success' });
      });
    }
    return _sqldb2.default.SenderId.create((0, _assign2.default)({}, req.body, { createdBy: req.user.id, updatedBy: req.user.id })).then(function (senderId) {
      notifyAdminSenderIdApproval(senderId);
      return res.json({ message: 'success' });
    });
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}

function deleteSenderId(req, res) {
  return _sqldb2.default.SenderId.destroy({ where: { id: req.params.id } }).then(function (data) {
    return res.json(data);
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}

function index(req, res, next) {
  if (req.user.roleId !== ADMIN) {
    var _req$query = req.query,
        status = _req$query.status,
        _fl = _req$query.fl;

    var promise = void 0;
    if (req.user.admin === 2) {
      promise = _promise2.default.resolve();
    } else if (req.user.admin) {
      promise = _sqldb2.default.User.findAll({ attributes: ['id'], where: { loginUrl: req.origin } });
    } else {
      promise = _promise2.default.resolve([req.user]);
    }
    return promise.then(function (users) {
      var where = { senderIdStatusId: { $not: 3 } };
      if (users) where.createdBy = users.map(function (x) {
        return x.id;
      });
      if (status) where.$and = { senderIdStatusId: status.split(',') };
      return _sqldb2.default.SenderId.findAll({
        attributes: _fl ? _fl.split(',') : ['id', 'name'],
        where: where,
        include: [{
          model: _sqldb2.default.User,
          as: 'CreatedBy',
          attributes: ['id', 'name', 'admin']
        }] }).then(function (data) {
        return res.json(data);
      });
    }).catch(function (err) {
      return handleError(res, 500, err);
    });
  }

  var _req$query2 = req.query,
      _req$query2$limit = _req$query2.limit,
      limit = _req$query2$limit === undefined ? 20 : _req$query2$limit,
      _req$query2$offset = _req$query2.offset,
      offset = _req$query2$offset === undefined ? 0 : _req$query2$offset,
      fl = _req$query2.fl,
      where = _req$query2.where;


  var options = {
    attributes: fl ? fl.split(',') : ['id', 'routeId', 'limit', 'userId'],
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

  return _promise2.default.all([_sqldb2.default.Selling.findAll(options), _sqldb2.default.Selling.count()]).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        routes = _ref2[0],
        numFound = _ref2[1];

    return res.json({ items: routes, meta: { numFound: numFound } });
  }).catch(next);
}

function show(req, res) {
  var promise = void 0;
  if (req.user.admin === 2) {
    promise = _promise2.default.resolve();
  } else if (req.user.admin) {
    promise = _sqldb2.default.User.findAll({ attributes: ['id'], where: { loginUrl: req.origin } });
  } else {
    promise = _promise2.default.resolve([req.user]);
  }
  return promise.then(function (users) {
    var where = { id: req.params.id };
    if (users) where.createdBy = users.map(function (x) {
      return x.id;
    });
    return _sqldb2.default.SenderId.find({
      where: where,
      include: [{
        model: _sqldb2.default.User,
        as: 'CreatedBy',
        attributes: ['id', 'name', 'admin']
      }] }).then(function (data) {
      return res.json(data);
    });
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}

function approve(req, res) {
  return _sqldb2.default.SenderId.update({ status: true }, { where: { id: req.params.id } }).then(function () {
    return res.status(202).end();
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}

function block(req, res) {
  return _sqldb2.default.SenderId.update({ status: false }, { where: { id: req.params.id } }).then(function () {
    return res.status(202).end();
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}

function createXls(req, res, next) {
  return _sqldb2.default.SenderId.findAll({}).then(function (data) {
    var senderId = data.map(function (x) {
      return x.name;
    });
    var wb = new _excel4node2.default.Workbook();
    var ws = wb.addWorksheet('Sheet 1');
    ws.cell(1, 1).string('Sender Ids');
    senderId.forEach(function (item, i) {
      ws.cell(i + 2, 1).string(item);
    });
    wb.write('Excel.xlsx', res);
  }).catch(next);
}
//# sourceMappingURL=senderId.controller.js.map

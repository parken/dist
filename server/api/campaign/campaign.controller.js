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
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    offset: Number(offset),
    where: { userId: req.user.id }
  };

  if (where) {
    options.where = where.split(',').reduce(function (nxt, x) {
      var _x$split = x.split(':'),
          _x$split2 = (0, _slicedToArray3.default)(_x$split, 2),
          key = _x$split2[0],
          value = _x$split2[1];

      return (0, _assign2.default)(nxt, (0, _defineProperty3.default)({}, key, value));
    }, options.where);
  }

  return _promise2.default.all([_sqldb2.default.Campaign.findAll(options), _sqldb2.default.Campaign.count()]).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        routes = _ref2[0],
        numFound = _ref2[1];

    return res.json({ items: routes, meta: { numFound: numFound } });
  }).catch(next);
}

function show(req, res, next) {
  return _sqldb2.default.Campaign.find({
    attributes: ['id', 'name'],
    where: {
      $or: [{ id: req.params.id }, { name: req.params.id }],
      userId: req.user.id
    }
  }).then(function (campaign) {
    return _sqldb2.default.MessageFly.find({
      where: { campaignId: campaign.id },
      order: [['createdAt', 'DESC']],
      include: [_sqldb2.default.SenderId]
    }).then(function (messageFly) {
      return _promise2.default.resolve([campaign, messageFly]);
    });
  }).then(function (_ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
        campaign = _ref4[0],
        _ref4$ = _ref4[1],
        senderId = _ref4$.SenderId.name,
        routeId = _ref4$.routeId,
        groupIds = _ref4$.groupIds,
        numbers = _ref4$.numbers;

    return res.json((0, _assign2.default)(campaign.toJSON(), { groupIds: groupIds, numbers: numbers, senderId: senderId, routeId: routeId }));
  }).catch(next);
}

function create(req, res, next) {
  return _sqldb2.default.Campaign.create((0, _assign2.default)({}, req.body, {
    createdBy: req.user.id,
    updatedBy: req.user.id
  })).then(function (_ref5) {
    var id = _ref5.id;
    return res.status(201).json({ id: id });
  }).catch(next);
}

function update(req, res, next) {
  return _sqldb2.default.Campaign.update((0, _assign2.default)({}, req.body, {
    active: false,
    updatedBy: req.user.id
  }), { where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function destroy(req, res, next) {
  return _sqldb2.default.Campaign.destroy({ where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}
//# sourceMappingURL=campaign.controller.js.map

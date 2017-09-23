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

exports.activeUpstream = activeUpstream;
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _helper = require('../../conn/sqldb/helper');

var _index = require('../../conn/sqldb/index');

var _index2 = _interopRequireDefault(_index);

var _constants = require('../../config/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADMIN = _constants.ROLES.ADMIN;
function activeUpstream(req, res, next) {
  if (req.user.roleId !== ADMIN) return next();
  var routeId = req.params.routeId;

  return _index2.default.Upstream.scope('active').find({ where: { routeId: routeId } }).then(function (_ref) {
    var id = _ref.id;
    return res.json({ id: id });
  }).catch(next);
}

function index(req, res, next) {
  if (req.user.roleId !== ADMIN) {
    return _index2.default.Route.findAll().then(function (routes) {
      return res.json(routes.map(function (x) {
        return x.toJSON();
      }).filter(function (x) {
        var route = x;
        route.balance = req.user['sendingBalance' + (0, _helper.getRouteType)(x.id)];
        route.credits = req.user['sellingBalance' + (0, _helper.getRouteType)(x.id)];
        return route.balance;
      }));
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

  return _promise2.default.all([_index2.default.Route.findAll(options), _index2.default.Route.count()]).then(function (_ref2) {
    var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
        routes = _ref3[0],
        numFound = _ref3[1];

    return res.json({ items: routes, meta: { numFound: numFound } });
  }).catch(next);
}

function show(req, res, next) {
  return _index2.default.Route.findById(req.params.id).then(function (route) {
    return res.json(route);
  }).catch(next);
}

function create(req, res, next) {
  return _index2.default.Route.create((0, _assign2.default)({}, req.body, {
    createdBy: req.user.id,
    updatedBy: req.user.id
  })).then(function (_ref4) {
    var id = _ref4.id;
    return res.status(201).json({ id: id });
  }).catch(next);
}

function update(req, res, next) {
  return _index2.default.Route.update((0, _assign2.default)({}, req.body, {
    active: false,
    updatedBy: req.user.id
  }), { where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function destroy(req, res, next) {
  return _index2.default.Route.destroy({ where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}
//# sourceMappingURL=route.controller.js.map

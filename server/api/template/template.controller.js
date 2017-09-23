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
exports.activate = activate;
exports.update = update;
exports.destroy = destroy;

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _constants = require('../../config/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CUSTOMER = _constants.ROLES.CUSTOMER;
function index(req, res, next) {
  if (req.user.roleId === CUSTOMER) {
    return _sqldb2.default.Template.findAll({
      attributes: ['id', 'name', 'content'],
      where: { userId: req.user.id }
    }).then(function (data) {
      return res.json(data);
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

  return _promise2.default.all([_sqldb2.default.Template.findAll(options), _sqldb2.default.Template.count()]).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        templates = _ref2[0],
        numFound = _ref2[1];

    return res.json({ items: templates, meta: { numFound: numFound } });
  }).catch(next);
}

function show(req, res, next) {
  return _sqldb2.default.Template.findById(req.params.id).then(function (template) {
    return res.json(template);
  }).catch(next);
}

function create(req, res, next) {
  return _sqldb2.default.Template.create((0, _assign2.default)({}, req.body, {
    createdBy: req.user.id,
    updatedBy: req.user.id
  })).then(function (_ref3) {
    var id = _ref3.id;
    return res.status(201).json({ id: id });
  }).catch(next);
}

function activate(req, res, next) {
  var id = req.params.id;

  _sqldb2.default.Template.findById(id).then(function (_ref4) {
    var routeId = _ref4.routeId;
    return _sqldb2.default.Template.deactivateOtherRoutes(_sqldb2.default, { routeId: routeId });
  }).then(function () {
    return _sqldb2.default.Template.update({ active: true }, { where: { id: id } });
  }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function update(req, res, next) {
  return _sqldb2.default.Template.update((0, _assign2.default)({}, req.body, {
    active: false,
    updatedBy: req.user.id
  }), { where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function destroy(req, res, next) {
  return _sqldb2.default.Template.destroy({ where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}
//# sourceMappingURL=template.controller.js.map

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
exports.create = create;

var _index = require('../../components/logger/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../conn/sqldb/index');

var _index4 = _interopRequireDefault(_index3);

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
    where: {},
    attributes: fl ? fl.split(',') : ['id', 'count'],
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

  if (req.params.upstreamId) options.where.upstreamId = req.params.upstreamId;

  return _promise2.default.all([_index4.default.UpstreamPlan.findAll(options), _index4.default.UpstreamPlan.count()]).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        upstreams = _ref2[0],
        numFound = _ref2[1];

    return res.json({ items: upstreams, meta: { numFound: numFound } });
  }).catch(next);
}

function create(req, res, next) {
  var count = req.body.count;

  if (!count || req.user.roleId !== 1) return res.status(400).json({ message: 'Invalid Request' });
  return _index4.default.UpstreamPlan.create({
    upstreamId: req.params.id,
    createdBy: req.user.id,
    updatedBy: req.user.id,
    count: count
  }).then(function () {
    return res.status(202).end();
  }).catch(next);
}
//# sourceMappingURL=upstreamPlan.controller.js.map

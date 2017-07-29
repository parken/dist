'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.createPlan = createPlan;

var _index = require('../../components/logger/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../conn/sqldb/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res, argStatusCode, err) {
  _index2.default.error('user.controller', err);
  var statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

function index(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 20 : _req$query$limit,
      _req$query$offset = _req$query.offset,
      offset = _req$query$offset === undefined ? 0 : _req$query$offset,
      fl = _req$query.fl;

  return _index4.default.Upstream.findAll({
    limit: limit,
    offset: offset
  }).then(function (upstreams) {
    return res.json(upstreams);
  }).catch(next);
}

function show(req, res, next) {
  return _index4.default.Upstream.findById(req.params.id).then(function (upstream) {
    return res.json(upstream);
  }).catch(next);
}

function create(req, res, next) {
  return _index4.default.Upstream.create((0, _assign2.default)({}, req.body, {
    createdBy: req.user.id,
    updatedBy: req.user.id
  })).then(function (_ref) {
    var id = _ref.id;
    return res.status(201).json({ id: id });
  }).catch(next);
}

function update(req, res, next) {
  return _index4.default.Upstream.update((0, _assign2.default)({}, req.body, { updatedBy: req.user.id }), { where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function destroy(req, res, next) {
  return _index4.default.Upstream.destory({ where: { id: req.params.id } }).then(function () {
    return res.status(201).end();
  }).catch(next);
}

function createPlan(req, res) {
  var count = req.body.count;

  if (!count || req.user.roleId !== 1) return res.status(404).json({ message: 'Invalid Request' });
  return _index4.default.UpstreamPlan.create({
    upstreamId: req.params.id,
    createdBy: req.user.id,
    updatedBy: req.user.id,
    count: count
  }).then(function () {
    return res.status(202).end();
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}
//# sourceMappingURL=upstream.controller.js.map

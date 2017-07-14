'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlan = createPlan;

var _index = require('../../components/logger/index');

var _index2 = _interopRequireDefault(_index);

var _helper = require('../../conn/sqldb/helper');

var _index3 = require('../../conn/sqldb/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res, argStatusCode, err) {
  console.log(err);
  _index2.default.error('user.controller', err);
  var statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
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

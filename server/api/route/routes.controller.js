'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

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

function index(req, res) {
  return _index4.default.Route.findAll().then(function (routes) {
    return res.json(routes.filter(function (x) {
      return req.user[(req.user.roleId === 4 ? 'selling' : 'sending') + 'Balance' + (0, _helper.getRouteType)(x.id)];
    }));
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}
//# sourceMappingURL=routes.controller.js.map

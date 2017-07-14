'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res, argStatusCode, err) {
  _logger2.default.error('user.controller', err);
  var statusCode = argStatusCode || 500;
  res.status(statusCode).send(err);
}

function index(req, res) {
  return _sqldb2.default.Template.findAll({
    attributes: ['id', 'name', 'content'],
    where: { userId: req.user.id }
  }).then(function (data) {
    return res.json(data);
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}
//# sourceMappingURL=template.controller.js.map

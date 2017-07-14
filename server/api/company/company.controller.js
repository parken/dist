'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.show = show;

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

function show(req, res) {
  return _sqldb2.default.User.find({
    attributes: ['id', ['companyName', 'name'], ['companyLogo', 'logo'], 'supportName', 'supportMobile', 'supportEmail', 'loginUrl'],
    where: { loginUrl: req.origin || 'msgque.com' }
  }).then(function (company) {
    if (!company) return res.status(404).json({ message: 'Invalid Request' });
    return res.json(company);
  }).catch(function (err) {
    return handleError(res, 500, err);
  });
}
//# sourceMappingURL=company.controller.js.map

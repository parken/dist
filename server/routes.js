'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  // Insert routes below
  app.use('/api/users', _user2.default);
  app.use('/api/roles', _role2.default);
  app.use('/api/shipments', _shipment2.default, _inShipment2.default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(_errors2.default[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    res.sendFile(_path2.default.resolve(app.get('appPath') + '/index.html'));
  });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('./components/errors');

var _errors2 = _interopRequireDefault(_errors);

var _user = require('./api/user');

var _user2 = _interopRequireDefault(_user);

var _role = require('./api/role');

var _role2 = _interopRequireDefault(_role);

var _shipment = require('./api/shipment');

var _shipment2 = _interopRequireDefault(_shipment);

var _inShipment = require('./api/shipment/inShipment');

var _inShipment2 = _interopRequireDefault(_inShipment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=routes.js.map

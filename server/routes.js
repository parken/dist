'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  // Insert routes below
  app.use('/api/users', _user2.default);
  app.use('/api/sms', _sms2.default);
  app.use('/api/senderId', _senderId2.default);
  app.use('/api/company', _company2.default);
  app.use('/api/contacts', _contact2.default);
  app.use('/api/routes', _route2.default);
  app.use('/api/groups', _group2.default);
  app.use('/api/templates', _template2.default);
  app.use('/api/campaigns', _campaign2.default);
  app.use('/api/upstreams', _upstream2.default);
  app.use('/api', _route2.default);

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

var _sms = require('./api/sms');

var _sms2 = _interopRequireDefault(_sms);

var _senderId = require('./api/senderId');

var _senderId2 = _interopRequireDefault(_senderId);

var _company = require('./api/company');

var _company2 = _interopRequireDefault(_company);

var _contact = require('./api/contact');

var _contact2 = _interopRequireDefault(_contact);

var _group = require('./api/group');

var _group2 = _interopRequireDefault(_group);

var _template = require('./api/template');

var _template2 = _interopRequireDefault(_template);

var _campaign = require('./api/campaign');

var _campaign2 = _interopRequireDefault(_campaign);

var _upstream = require('./api/upstream');

var _upstream2 = _interopRequireDefault(_upstream);

var _route = require('./api/route');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=routes.js.map

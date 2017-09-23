'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  // Insert routes below
  app.use('/api/auth', _auth4.default);
  app.use('/api/users', _user2.default);
  app.use('/api/roles', _role2.default);
  app.use('/api/messages', _message2.default);
  app.use('/api/sms', _sms2.default);
  app.use('/api/senderId', _senderId2.default);
  app.use('/api/senderIds', _senderId2.default);
  app.use('/api/company', _company2.default);
  app.use('/api/contacts', _contact2.default);
  app.use('/api/routes', _route2.default);
  app.use('/api/groups', _group2.default, _contact4.default);
  app.use('/api/templates', _template2.default);
  app.use('/api/campaigns', _campaign2.default);
  app.use('/api/upstreams', _auth2.default, only([ADMIN, RESELLER]), _upstream2.default, _plan2.default);
  app.use('/api/messageFly', _messageFly2.default);
  app.use('/api/messageFlies', _messageFly2.default, _message4.default);
  app.use('/api/transactions', _auth2.default, only([ADMIN, RESELLER]), _transaction2.default);
  app.use('/api/loginIdentifiers', _loginIdentifier2.default);
  app.use('/api/priorityNumbers', _auth2.default, only([ADMIN, RESELLER]), _priorityNumber2.default);

  app.use('/api/sending', _auth2.default, only([ADMIN, RESELLER]), _sending2.default);
  app.use('/api/credits', _auth2.default, only([ADMIN, RESELLER]), _selling2.default);
  app.use('/api/sessions', _auth2.default, only([ADMIN, RESELLER]), _session2.default);
  app.use('/api/domains', _domain2.default);

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

var _auth = require('./components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

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

var _contact3 = require('./api/group/contact');

var _contact4 = _interopRequireDefault(_contact3);

var _template = require('./api/template');

var _template2 = _interopRequireDefault(_template);

var _campaign = require('./api/campaign');

var _campaign2 = _interopRequireDefault(_campaign);

var _upstream = require('./api/upstream');

var _upstream2 = _interopRequireDefault(_upstream);

var _plan = require('./api/upstream/plan');

var _plan2 = _interopRequireDefault(_plan);

var _route = require('./api/route');

var _route2 = _interopRequireDefault(_route);

var _message = require('./api/message');

var _message2 = _interopRequireDefault(_message);

var _loginIdentifier = require('./api/loginIdentifier');

var _loginIdentifier2 = _interopRequireDefault(_loginIdentifier);

var _messageFly = require('./api/messageFly');

var _messageFly2 = _interopRequireDefault(_messageFly);

var _message3 = require('./api/messageFly/message');

var _message4 = _interopRequireDefault(_message3);

var _priorityNumber = require('./api/priorityNumber');

var _priorityNumber2 = _interopRequireDefault(_priorityNumber);

var _transaction = require('./api/transaction');

var _transaction2 = _interopRequireDefault(_transaction);

var _role = require('./api/role');

var _role2 = _interopRequireDefault(_role);

var _selling = require('./api/selling');

var _selling2 = _interopRequireDefault(_selling);

var _sending = require('./api/sending');

var _sending2 = _interopRequireDefault(_sending);

var _session = require('./api/session');

var _session2 = _interopRequireDefault(_session);

var _domain = require('./api/domain');

var _domain2 = _interopRequireDefault(_domain);

var _constants = require('./config/constants');

var _auth3 = require('./components/auth');

var _auth4 = _interopRequireDefault(_auth3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADMIN = _constants.ROLES.ADMIN,
    RESELLER = _constants.ROLES.RESELLER; /**
                                           * Main application routes
                                           */

var only = function only(roleIds) {
  return function (req, res, next) {
    return roleIds.includes(req.user.roleId) ? next() : res.status(400).end();
  };
};
//# sourceMappingURL=routes.js.map

'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./contact.controller');

var router = express.Router();

router.post('/sync', (0, _auth2.default)(), controller.syncContact);

module.exports = router;
//# sourceMappingURL=index.js.map

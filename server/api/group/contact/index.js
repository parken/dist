'use strict';

var _auth = require('../../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('../../contact/contact.controller');

var router = express.Router();

router.post('/sync', _auth2.default, controller.syncContact);

router.get('/:groupId/contacts', _auth2.default, controller.index);

module.exports = router;
//# sourceMappingURL=index.js.map

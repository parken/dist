'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./group.controller');

var router = express.Router();

router.get('/', _auth2.default, controller.index);
router.post('/', _auth2.default, controller.create);
router.post('/:name/email/:email', _auth2.default, controller.addEmailToGroup);

module.exports = router;
//# sourceMappingURL=index.js.map

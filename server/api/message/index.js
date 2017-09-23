'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var router = express.Router();
var controller = require('./message.controller');

router.get('/', _auth2.default, controller.index);
router.get('/:id', _auth2.default, controller.show);

module.exports = router;
//# sourceMappingURL=index.js.map

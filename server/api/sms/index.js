'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./sms.controller');


var router = express.Router();

router.get('/excel', controller.createExcel);
router.get('/:id', controller.show);
router.post('/', (0, _auth2.default)(), controller.create);

module.exports = router;
//# sourceMappingURL=index.js.map

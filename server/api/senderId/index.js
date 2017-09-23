'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./senderId.controller');

var router = express.Router();

router.post('/', _auth2.default, controller.create);
router.get('/', _auth2.default, controller.index);
router.get('/xls', controller.createXls);
router.get('/:id', _auth2.default, controller.show);
router.put('/:id/block', _auth2.default, controller.block);
router.put('/:id/approve', _auth2.default, controller.approve);
router.delete('/:id', _auth2.default, controller.deleteSenderId);
module.exports = router;
//# sourceMappingURL=index.js.map

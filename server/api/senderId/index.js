'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./senderId.controller');


var router = express.Router();

router.post('/', (0, _auth2.default)(), controller.create);
router.get('/', (0, _auth2.default)(), controller.index);
router.get('/xls', controller.createXls);
router.get('/:id', (0, _auth2.default)(), controller.show);
router.put('/:id/block', (0, _auth2.default)(), controller.block);
router.put('/:id/approve', (0, _auth2.default)(), controller.approve);
router.delete('/:id', (0, _auth2.default)(), controller.deleteSenderId);
module.exports = router;
//# sourceMappingURL=index.js.map

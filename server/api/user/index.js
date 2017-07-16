'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', (0, _auth2.default)(), controller.index);

router.get('/me', (0, _auth2.default)(), controller.me);
router.get('/duplicate', controller.duplicate);
router.get('/checkExists', controller.checkExists);
router.get('/uuid/:uuid', controller.showUuid);
router.get('/:id', (0, _auth2.default)(), controller.show);
router.get('/:id/sendLogin', (0, _auth2.default)(), controller.sendLogin);

router.post('/', (0, _auth2.default)(), controller.create);
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/otpLogin', controller.otpLogin);
router.post('/otp', controller.otpSend);
router.post('/otpVerify', controller.otpVerify);
router.post('/:id', (0, _auth2.default)(), controller.update);
router.post('/:id/selling', (0, _auth2.default)(), controller.addSelling);
router.post('/:id/sellingRoot', (0, _auth2.default)(), controller.addSellingRootUser);

router.put('/', (0, _auth2.default)(), controller.update);
router.put('/password', controller.passwordChange);

module.exports = router;
//# sourceMappingURL=index.js.map

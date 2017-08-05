'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', _auth2.default, controller.index);

router.get('/me', _auth2.default, controller.me);
router.get('/duplicate', controller.duplicate);
router.get('/checkExists', controller.checkExists);
router.get('/uuid/:uuid', controller.showUuid);
router.get('/:id', _auth2.default, controller.show);
router.get('/:id/sendLogin', _auth2.default, controller.sendLogin);

router.post('/', _auth2.default, controller.create);
router.post('/signup', controller.signup);
router.post('/customer', _auth2.default, controller.createCustomer);
router.post('/login', controller.login);
router.post('/googleLogin', controller.googleLogin);
router.post('/otpLogin', controller.otpLogin);
router.post('/otp', controller.otpSend);
router.post('/otpVerify', controller.otpVerify);
router.post('/:id', _auth2.default, controller.update);
router.put('/:id', _auth2.default, controller.update);
router.post('/:id/selling', _auth2.default, controller.addSelling);
router.post('/:id/sellingRoot', _auth2.default, controller.addSellingRootUser);

router.put('/', _auth2.default, controller.update);
router.put('/password', controller.passwordChange);

module.exports = router;
//# sourceMappingURL=index.js.map

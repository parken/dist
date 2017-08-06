'use strict';

var _auth = require('../../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var controller = require('./inShipment.controller');

var router = express.Router();

router.get('/:shipmentId/inShipments', _auth2.default, controller.index);
router.get('/:shipmentId/inShipments/:id', _auth2.default, controller.show);
router.post('/:shipmentId/inShipments/', _auth2.default, controller.create);
router.post('/:shipmentId/inShipments/:id', _auth2.default, controller.update);
router.put('/:shipmentId/inShipments/:id', _auth2.default, controller.update);
router.post('/:shipmentId/inShipments/:id', _auth2.default, controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map

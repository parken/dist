'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

var _upstream = require('./upstream.controller');

var controller = _interopRequireWildcard(_upstream);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', _auth2.default, controller.index);
router.get('/:id', _auth2.default, controller.show);

router.post('/', _auth2.default, controller.create);
router.post('/:id', _auth2.default, controller.update);
router.put('/:id', _auth2.default, controller.update);
router.post('/:id', _auth2.default, controller.destroy);
router.post('/:id/plan', _auth2.default, controller.createPlan);

module.exports = router;
//# sourceMappingURL=index.js.map

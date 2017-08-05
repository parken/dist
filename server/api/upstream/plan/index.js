'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

var _upstreamPlan = require('../../upstreamPlan/upstreamPlan.controller');

var controller = _interopRequireWildcard(_upstreamPlan);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:upstreamId/plans', _auth2.default, controller.index);
router.post('/:id/plans', _auth2.default, controller.create);

module.exports = router;
//# sourceMappingURL=index.js.map

'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _upstream = require('./upstream.controller');

var controller = _interopRequireWildcard(_upstream);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

router.post('/', controller.create);
router.post('/:id/activate', controller.activate);
router.post('/:id', controller.update);
router.put('/:id', controller.update);
router.post('/:id', controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map

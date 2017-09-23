'use strict';

var _google = require('./google');

var _google2 = _interopRequireDefault(_google);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

router.use('/google', _google2.default);

module.exports = router;
//# sourceMappingURL=index.js.map

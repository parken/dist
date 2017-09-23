'use strict';

var express = require('express');

var router = express.Router();
var controller = require('./session.controller');

router.get('/', controller.index);

module.exports = router;
//# sourceMappingURL=index.js.map

'use strict';

var express = require('express');

var router = express.Router();
var controller = require('./selling.controller');

router.get('/', controller.index);
router.post('/', controller.create);

module.exports = router;
//# sourceMappingURL=index.js.map

'use strict';

var express = require('express');
var controller = require('./company.controller');

var router = express.Router();

router.get('/', controller.show);

module.exports = router;
//# sourceMappingURL=index.js.map

'use strict';

var express = require('express');
var controller = require('./google.controller');
var router = express.Router();

router.get('/login', controller.login);
router.get('/callback', controller.callback);

module.exports = router;
//# sourceMappingURL=index.js.map

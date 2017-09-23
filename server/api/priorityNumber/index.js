'use strict';

var express = require('express');
var controller = require('./priorityNumber.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id', controller.update);
router.put('/:id', controller.update);
router.post('/:id', controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map

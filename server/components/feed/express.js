'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  app.use('/api/feed', feed);
};

var _feed = require('./feed');

var _feed2 = _interopRequireDefault(_feed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var feed = function feed(req, res) {
  return res.json(_feed2.default);
};
//# sourceMappingURL=express.js.map

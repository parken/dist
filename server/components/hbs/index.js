'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hbs = {
  render: function render(view, data) {
    var template = _fs2.default.readFileSync(_path2.default.join(_environment2.default.root, 'server/components/hbs/templates') + '/' + view + '.hbs', 'utf8');
    return _handlebars2.default.compile(template)((0, _assign2.default)(hbs.defaults[template] || {}, data));
  }
};

hbs.fields = function (view) {
  var template = _fs2.default.readFileSync(_path2.default.join(_environment2.default.root, 'server/components/hbs/templates') + '/' + view + '.hbs', 'utf8');
  return template.match(/{([^{}]+)}/g).map(function (x) {
    return x.slice(1, -1);
  }).filter(function (x) {
    return !x.includes(' ');
  });
};

exports.default = hbs;
//# sourceMappingURL=index.js.map

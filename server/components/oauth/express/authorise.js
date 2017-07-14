'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res) {
  return _sqldb.App.findOne({
    where: {
      clientId: req.query.client_id,
      redirectUri: req.query.redirect_uri
    },
    attributes: ['id', 'name']
  }).then(function (model) {
    if (!model) return res.status(404).json({ error: 'Invalid Client' });
    return res.json(model);
  }).catch(function (err) {
    return res.status(400).json(err);
  });
};

var _sqldb = require('../../../conn/sqldb');
//# sourceMappingURL=authorise.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (database) {
  var db = database;
  db.RefreshToken = db.sequelize.import('./refreshToken.model');
  db.AccessToken = db.sequelize.import('./accessToken.model');
  db.App = db.sequelize.import('./app.model');
  db.AuthCode = db.sequelize.import('./authCode.model');
  db.Session = db.sequelize.import('./session.model');
};
//# sourceMappingURL=index.js.map

'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function SessionModel(sequelize, DataTypes) {
  var Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    device: DataTypes.STRING,
    os: DataTypes.STRING,
    browser: DataTypes.STRING,
    country: DataTypes.STRING,
    region: DataTypes.STRING,
    city: DataTypes.STRING,
    ip: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    metro: DataTypes.STRING,
    zip: DataTypes.STRING
  }, {
    tableName: 'sessions',
    timestamps: true,

    classMethods: {
      associate: function associate(db) {
        Session.hasMany(db.AccessToken, {
          foreignKey: 'sessionId'
        });

        Session.hasMany(db.AuthCode, {
          foreignKey: 'sessionId'
        });

        Session.hasMany(db.RefreshToken, {
          foreignKey: 'sessionId'
        });

        Session.belongsTo(db.User, {
          foreignKey: 'userId'
        });
      },
      logout: function logout(_ref, id) {
        var AccessToken = _ref.AccessToken,
            RefreshToken = _ref.RefreshToken;

        var where = { where: { sessionId: id } };
        return Session.destroy({ where: { id: id } }).then(function () {
          return _promise2.default.all([RefreshToken.update({ expires: new Date() }, where), AccessToken.update({ expires: new Date() }, where)]);
        });
      }
    }
  });

  return Session;
};
//# sourceMappingURL=session.model.js.map

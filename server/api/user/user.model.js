'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    mobile: DataTypes.INTEGER,
    email: DataTypes.STRING,
    otp: DataTypes.STRING,
    otpStatus: DataTypes.INTEGER,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    admin: DataTypes.INTEGER,
    companyName: DataTypes.STRING,
    companyAddress: DataTypes.STRING,
    companyLogo: DataTypes.STRING,
    supportName: DataTypes.STRING,
    supportMobile: DataTypes.BIGINT,
    supportEmail: DataTypes.STRING,
    loginUrl: DataTypes.STRING,
    slackUrl: DataTypes.STRING,
    slackActive: DataTypes.BOOLEAN,
    smsActive: DataTypes.BOOLEAN,
    transactionalStartFrom: DataTypes.INTEGER,
    transactionalPercent: DataTypes.INTEGER,
    promotionalStartFrom: DataTypes.INTEGER,
    promotionalPercent: DataTypes.INTEGER,
    otpStartFrom: DataTypes.INTEGER,
    otpPercent: DataTypes.INTEGER,
    senderIdStartFrom: DataTypes.INTEGER,
    senderIdPercent: DataTypes.INTEGER,
    expiresAt: DataTypes.DATE,
    sellingBalanceTransactional: DataTypes.INTEGER,
    sendingBalanceTransactional: DataTypes.INTEGER,
    sellingBalancePromotional: DataTypes.INTEGER,
    sendingBalancePromotional: DataTypes.INTEGER,
    sellingBalanceSenderId: DataTypes.INTEGER,
    sendingBalanceSenderId: DataTypes.INTEGER,
    sellingBalanceOTP: DataTypes.INTEGER,
    sendingBalanceOTP: DataTypes.INTEGER
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    instanceMethods: {
      hashPassword: function hashPassword(password) {
        return _crypto2.default.createHash('md5').update(salt + password).digest('hex');
      },
      verifyPasswordAsync: function verifyPasswordAsync(password) {
        var hashedPass = _crypto2.default.createHash('md5').update(salt + password).digest('hex');
        return hashedPass === this.password ? _promise2.default.resolve(_lodash2.default.pick(this.toJSON(), ['id'])) : _promise2.default.reject({ code: 400, message: 'Check password!' });
      },
      verifyPassword: function verifyPassword(password, cb) {
        return User.hashPassword(password) === this.password ? cb(null, this.toJSON()) : cb(null, false);
      },
      revokeTokens: function revokeTokens(db) {
        var expires = new Date();
        return _promise2.default.all([db.AccessToken.update({ expires: expires }, { where: { userId: this.id } }), db.RefreshToken.update({ expires: expires }, { where: { userId: this.id } })]);
      }
    },

    classMethods: {
      associate: function associate(db) {
        this.db = db;
        User.belongsTo(db.Role, {
          foreignKey: 'roleId'
        });
        User.belongsTo(db.App, {
          foreignKey: 'appId'
        });
        User.belongsTo(User, {
          foreignKey: 'createdBy',
          allowNull: true,
          as: 'CreatedBy'
        });
        User.belongsTo(User, {
          foreignKey: 'resellerId',
          allowNull: true,
          as: 'ResellerId'
        });
      },
      checkEmailExists: function checkEmailExists(db, email) {
        return db.User.count({ where: { email: email } }).then(function (rows) {
          if (rows > 0) return _promise2.default.resolve(true);
          return _promise2.default.resolve(false);
        });
      },
      checkMobileExists: function checkMobileExists(db, mobile) {
        return db.User.count({ where: { mobile: mobile } }).then(function (rows) {
          if (rows > 0) return _promise2.default.resolve(true);
          return _promise2.default.resolve(false);
        });
      },
      checkExists: function checkExists(db, email, mobile) {
        return _promise2.default.all([email ? db.User.checkEmailExists(db, email) : _promise2.default.resolve(false), mobile ? db.User.checkMobileExists(db, mobile) : _promise2.default.resolve(false)]).then(function (_ref) {
          var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
              e = _ref2[0],
              m = _ref2[1];

          return { email: e, mobile: m };
        });
      },
      hashPassword: function hashPassword(password) {
        return _crypto2.default.createHash('md5').update(salt + password).digest('hex');
      }
    },
    hooks: {
      beforeCreate: function beforeCreate(instance) {
        if (instance.changed('password')) {
          instance.set('password', this.db.User.hashPassword(instance.password));
        }
      },
      beforeUpdate: function beforeUpdate(instance) {
        if (instance.changed('password')) {
          instance.set('password', instance.hashPassword(instance.password));
        }
      }
    }
  });

  return User;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var salt = 'DYhG93b0fIxfs2guVoUubasdfajfkljasdjfaklsdjflakrfWwvniR2G0FgaC9mi';
//# sourceMappingURL=user.model.js.map

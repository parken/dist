'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (sequelize, DataTypes) {
  var Domain = sequelize.define('Domain', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    status: DataTypes.INTEGER,
    classkey: DataTypes.STRING,
    price: DataTypes.STRING,
    existing: DataTypes.BOOLEAN,
    expiresAt: { type: DataTypes.DATE }
  }, {
    tableName: 'domains',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function associate(db) {
        Domain.belongsTo(db.User, {
          foreignKey: 'userId',
          allowNull: false
        });
        Domain.belongsTo(db.DomainType, {
          foreignKey: 'domainTypeId',
          allowNull: true
        });
      }
    },
    hooks: {
      afterCreate: function afterCreate(instance) {
        if (instance.existing) return _promise2.default.resolve();
        if (!_hosting2.default.ownDomains.some(function (x) {
          return instance.name.endsWith(x);
        })) {
          return _promise2.default.resolve();
        }
        return _promise2.default.all([_hosting2.default.s3.generateWebsite(instance.name), _hosting2.default.s3.register(instance.name)]).then(function (_ref) {
          var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
              domainPath = _ref2[0],
              s3site = _ref2[1];

          return _promise2.default.all([_hosting2.default.domain.createCNAME(instance.name.slice(-6), {
            name: instance.name.split('.').shift(),
            data: s3site.url.substr(7) + '.'
          }), _hosting2.default.s3.deploy(instance.name)]);
        });
      }
    }
  });

  return Domain;
};

var _hosting = require('../../components/hosting');

var _hosting2 = _interopRequireDefault(_hosting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=domain.model.js.map

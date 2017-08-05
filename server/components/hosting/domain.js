'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.searchDomains = searchDomains;
exports.register = register;
exports.customerPrice = customerPrice;
exports.reset = reset;
exports.deleteCname = deleteCname;
exports.createCNAME = createCNAME;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _environment = require('../../config/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiurl = 'https://httpapi.com';
var resellerid = _environment.RESELLER_ID;
var apikey = _environment.RESELLER_API_KEY;

var cache = {};

function searchDomains(q) {
  return (0, _requestPromise2.default)({
    method: 'GET',
    uri: apiurl + '/api/domains/available.json',
    query: {
      'auth-userid': resellerid,
      'api-key': apikey,
      'domain-name': q,
      tlds: 'com'
    },
    json: true
  }).then(function (domainsMap) {
    return (0, _keys2.default)(domainsMap).map(function (key) {
      return (0, _assign2.default)({
        name: key,
        price: cache.customerPrice[domainsMap[key].classkey].addnewdomain[1]
      }, domainsMap[key]);
    });
  });
}

function register(domain) {
  if (domain.endsWith('91.co')) return _promise2.default.resolve({ message: 'registration success' });

  // if not 91.co register from resellerclub
  return (0, _requestPromise2.default)({
    method: 'POST',
    uri: apiurl + '/api/domains/api/domains/register.json',
    body: {
      'auth-userid': resellerid,
      'api-key': apikey,
      'domain-name': domain,
      years: '1',
      ns: ['ns1.digitalocean.com', 'ns2.digitalocean.com'],
      'customer-id': '382718速-contact-id=2558879',
      'admin-contact-id': '17420190', // yog27ray
      'tech-contact-id': '17420190', // yog27ray
      'billing-contact-id': '17420190', // yog27ray
      'invoice-option': 'KeepInvoice',
      'protect-privacy': false
    },
    json: true
  });
}

// need to whitelist ip from https://manage.resellerclub.com/
function customerPrice() {
  if (cache.customerPrice) return cache.customerPrice;
  return (0, _requestPromise2.default)({
    method: 'GET',
    uri: apiurl + '/api/products/customer-price.json',
    query: {
      'auth-userid': resellerid,
      'api-key': apikey
    },
    json: true
  }).then(function (data) {
    cache.customerPrice = data;
    return data;
  });
}

function reset() {
  cache = {};
}

function deleteCname(domain) {
  // https://api.digitalocean.com/v2/domains/example.com/records/3352896
  // need to store id when cname created, then only deletion possible
  return _promise2.default.resolve();
}

// call for password
function createCNAME() {
  var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'w91.co';
  var _ref = arguments[1];
  var _ref$name = _ref.name,
      name = _ref$name === undefined ? 'yog27ray' : _ref$name,
      _ref$data = _ref.data,
      data = _ref$data === undefined ? 'yog27ray.w91.co.s3-website.ap-south-1.amazonaws.com' : _ref$data;

  return (0, _requestPromise2.default)({
    method: 'POST',
    uri: 'https://api.digitalocean.com/v2/domains/' + domain + '/records',
    body: {
      type: 'CNAME',
      name: name,
      data: data,
      priority: null,
      port: null,
      ttl: 1800,
      weight: null
    },
    headers: {
      Authorization: 'Bearer ' + _environment.DO_TOKEN
    },
    json: true
  });
}

exports.default = {
  searchDomains: searchDomains,
  register: register,
  customerPrice: customerPrice,
  reset: reset,
  createCNAME: createCNAME
};
//# sourceMappingURL=domain.js.map

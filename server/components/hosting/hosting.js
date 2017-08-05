'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.register = register;
exports.deploy = deploy;
exports.generateWebsite = generateWebsite;

var _s3Website = require('s3-website');

var _s3Website2 = _interopRequireDefault(_s3Website);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fileStructure = require('../fileStructure');

var _fileStructure2 = _interopRequireDefault(_fileStructure);

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _environment = require('../../config/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function register(domain) {
  var config = {
    region: 'eu-central-1',
    domain: domain
  };

  return new _promise2.default(function (res, rej) {
    return _s3Website2.default.s3site(config, function (err, website) {
      if (err) return rej(err);
      return res(website);
    });
  });
}

function deploy(domain) {
  var options = { domain: domain };
  return new _promise2.default(function (res, rej) {
    return _s3Website2.default.s3site((0, _assign2.default)(options, {
      region: 'eu-central-1', // optional, default: us-east-1
      index: 'index.html',
      error: 'index.html',
      uploadDir: _environment.root + '/websites/' + domain,
      deploy: true
    }), function (err, website) {
      if (err) return rej(err);
      var s3 = new _awsSdk2.default.S3({
        accessKeyId: _environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: _environment.AWS_SECRET_ACCESS_KEY,
        region: 'eu-central-1'
      });
      // check if website works
      return s3.putObject({
        Bucket: domain,
        Key: 'index.html',
        ACL: 'public-read',
        Body: '<h1>' + domain + '</h1>',
        ContentType: 'text/html'
      }, function (error) {
        _logger2.default.error('s3.putObject', website, error);
        return res(website);
      });
    });
  });
}

function generateWebsite(domain, option) {
  return _fileStructure2.default.writeFile('/websites/' + domain + '/index.html', option);
}

function deleteDomain(domain) {
  var s3 = new _awsSdk2.default.S3({
    region: 'eu-central-1',
    accessKeyId: _environment.AWS_ACCESS_KEY_ID,
    secretAccessKey: _environment.AWS_SECRET_ACCESS_KEY
  });

  return new _promise2.default(function (res, rej) {
    return s3.deleteObjects({
      Bucket: domain,
      Delete: {
        Objects: [{ Key: 'index.html' }]
      }
    }, function (err) {
      if (err) return rej(err);
      s3.deleteBucket({ Bucket: domain }, function (error, data) {
        if (err) return rej(error);
        return res(data);
      });
    });
  });
}

exports.default = {
  register: register,
  deploy: deploy,
  generateWebsite: generateWebsite,
  deleteDomain: deleteDomain
};
//# sourceMappingURL=hosting.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csvSMS = exports.scheduledSMS = exports.groupSMS = exports.transactionalSMS = exports.anySMS = exports.signatureSMS = exports.duplicateSMS = exports.flashSMS = exports.unicodeSMS = exports.promotionalSMS = exports.sms = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _constants = require('../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smsTypes = _constants2.default.smsTypes,
    routes = _constants2.default.routes;
var PLAIN = smsTypes.PLAIN,
    UNICODE = smsTypes.UNICODE;
var PROMOTIONAL = routes.PROMOTIONAL,
    TRASACTIONAL = routes.TRASACTIONAL,
    SENDER_ID = routes.SENDER_ID,
    OTP = routes.OTP;

// Todo: return error bucket

var sms = exports.sms = {
  route_id: {
    type: 'number',
    enum: [PROMOTIONAL, TRASACTIONAL, SENDER_ID, OTP]
  },
  message: {
    type: 'string'
  },
  campaign_name: {
    type: 'string',
    maxLength: 255
  }
};

var smsRequired = ['route_id', 'message'];

var promotionalSMS = exports.promotionalSMS = { // === otp
  title: 'PromotionalSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers: {
      type: 'string',
      minLength: 10
    }
  }),
  required: smsRequired.concat(['mobile_numbers'])
};

var unicodeSMS = exports.unicodeSMS = {
  title: 'UnicodeSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers: {
      type: 'string',
      minLength: 10
    },
    sms_type: {
      type: 'number',
      enum: [PLAIN, UNICODE],
      default: PLAIN
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'sms_type'])
};

var flashSMS = exports.flashSMS = {
  title: 'FlashSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers: {
      type: 'string',
      minLength: 10
    },
    flash_sms: {
      type: 'boolean',
      default: false
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'flash_sms'])
};

var duplicateSMS = exports.duplicateSMS = {
  title: 'FlashSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers: {
      type: 'string',
      minLength: 10
    },
    duplicate: {
      type: 'boolean',
      default: false // if lastmessage == current message
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'duplicate'])
};

var signatureSMS = exports.signatureSMS = {
  title: 'FlashSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers: {
      type: 'string',
      minLength: 10
    },
    signature: {
      type: 'boolean',
      default: false
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'signature'])
};

var anySMS = exports.anySMS = {
  title: 'AnySMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers: {
      type: 'string',
      minLength: 10
    }
  }),
  oneOf: [{ required: smsRequired.concat(['mobile_numbers_from_csv']) }, { required: smsRequired.concat(['mobile_numbers']) }, { required: smsRequired.concat(['group_ids']) }]
};

var transactionalSMS = exports.transactionalSMS = {
  title: 'TrasactionalSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    sender_id: {
      type: 'string',
      minLength: 6,
      maxLength: 6
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'sender_id'])
};

var groupSMS = exports.groupSMS = {
  title: 'GroupSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    group_ids: {
      type: 'array',
      items: {
        type: 'number'
      }
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'group_ids'])
};

var scheduledSMS = exports.scheduledSMS = {
  title: 'ScheduledSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    scheduled_on: {
      type: 'string',
      format: 'date-time'
    }
  }),
  required: smsRequired.concat(['mobile_numbers', 'scheduled_on'])
};

var csvSMS = exports.csvSMS = {
  title: 'CSVSMS',
  type: 'object',
  properties: (0, _assign2.default)(sms, {
    mobile_numbers_from_csv: {
      type: 'array',
      items: {
        type: 'number',
        minimum: 7000000000,
        maximum: 9999999999
        // pattern: '^[789]\\d{9},' pattern works with strings
      }
    }
  }),
  required: smsRequired.concat(['mobile_numbers_from_csv'])
};
//# sourceMappingURL=sms.schema.js.map

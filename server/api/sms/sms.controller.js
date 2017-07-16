'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.show = show;
exports.create = create;
exports.createExcel = createExcel;

var _excel4node = require('excel4node');

var _excel4node2 = _interopRequireDefault(_excel4node);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _sqldb = require('../../conn/sqldb');

var _sqldb2 = _interopRequireDefault(_sqldb);

var _logger = require('../../components/logger');

var _logger2 = _interopRequireDefault(_logger);

var _notify = require('../../components/notify');

var _senderId = require('../../components/senderId');

var _senderId2 = _interopRequireDefault(_senderId);

var _smsManager = require('../../components/smsManager');

var _smsManager2 = _interopRequireDefault(_smsManager);

var _constants = require('../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _sms = require('./sms.schema');

var schema = _interopRequireWildcard(_sms);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smsTypes = _constants2.default.smsTypes,
    routes = _constants2.default.routes;
var PLAIN = smsTypes.PLAIN,
    UNICODE = smsTypes.UNICODE;
var PROMOTIONAL = routes.PROMOTIONAL,
    TRASACTIONAL = routes.TRASACTIONAL,
    SENDER_ID = routes.SENDER_ID,
    OTP = routes.OTP;


function sendSms(text, list) {
  var to = list.shift();
  if (to) {
    return (0, _notify.sms)({ to: to, text: text }).then(function () {
      return sendSms(text, list);
    }).catch(function () {
      return sendSms(text, list);
    });
  }
  return _promise2.default.resolve();
}

function show(req, res) {
  return res.json({ id: 1 });
}

function create(req, res, next) {
  var _req$body = req.body,
      groupId = _req$body.groupId,
      numbers = _req$body.numbers,
      text = _req$body.text,
      campaign = _req$body.campaign,
      routeId = _req$body.routeId,
      _req$body$unicode = _req$body.unicode,
      unicode = _req$body$unicode === undefined ? false : _req$body$unicode,
      _req$body$flash = _req$body.flash,
      flash = _req$body$flash === undefined ? false : _req$body$flash,
      senderId = _req$body.senderId,
      scheduledOn = _req$body.scheduledOn;


  if (!routeId || !text) {
    return res.status(400).status({ message: 'arguements missing. (route_id or message)' });
  }

  var validate = function validate() {
    var ajv = new _ajv2.default();
    var current = void 0;
    if (req.body.route_id === PROMOTIONAL) {
      current = schema.promotionalSMS;
    } else {
      current = schema.anySMS;
    }

    ajv.addSchema(current, 'CurrentSchema');
    ajv.validate('CurrentSchema', req.body);
    return ajv.errorsText();
  };

  var err = validate(req.body);

  if (!err) return res.status(400).json({ message: err });

  var sendingTime = (scheduledOn ? new Date(scheduledOn) : new Date()).getHours();

  if (req.body.route_id === PROMOTIONAL && sendingTime >= 9 && sendingTime < 21) {
    return res.status(400).json({ message: 'Promotional SMS is allowed from 9AM to 9PM' });
  }

  return _smsManager2.default.sendSms({ text: text,
    user: req.user,
    routeId: routeId,
    senderId: senderId,
    campaign: campaign,
    unicode: unicode,
    flash: flash,
    scheduledOn: scheduledOn,
    numbers: numbers,
    groupIds: groupId }).then(function () {
    return res.json({ message: 'Messages Sent.' });
  }).catch(next);
}

function createExcel(req, res, next) {
  return _sqldb2.default.MessageFly.findAll({
    include: [_sqldb2.default.SenderId, _sqldb2.default.Route, _sqldb2.default.Campaign]
  }).then(function (data) {
    var wb = new _excel4node2.default.Workbook();
    var ws = wb.addWorksheet('Sheet 1');
    ws.cell(1, 1).string('Text');
    ws.cell(1, 2).string('groupIds');
    ws.cell(1, 3).string('numbers');
    ws.cell(1, 4).string('total');
    ws.cell(1, 5).string('unicode');
    ws.cell(1, 6).string('flash');
    ws.cell(1, 7).string('scheduledOn');
    ws.cell(1, 8).string('routeId');
    ws.cell(1, 9).string('senderId');
    ws.cell(1, 10).string('campaignId');
    data.forEach(function (item, i) {
      ws.cell(i + 2, 1).string(item.text || '');
      ws.cell(i + 2, 2).string(item.groupIds || '');
      ws.cell(i + 2, 3).string(item.numbers || '');
      ws.cell(i + 2, 4).number(item.total);
      ws.cell(i + 2, 5).bool(item.unicode);
      ws.cell(i + 2, 6).bool(item.flash);
      ws.cell(i + 2, 7).string(item.scheduledOn || '');
      ws.cell(i + 2, 8).string(item.Route.name);
      ws.cell(i + 2, 9).string(item.SenderId.name);
      ws.cell(i + 2, 10).string(item.Campaign.name);
    });
    wb.write('Excel.xlsx', res);
  }).catch(next);
}
//# sourceMappingURL=sms.controller.js.map

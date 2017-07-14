'use strict';

var _auth = require('../../components/oauth/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var router = express.Router();
var controller = require('./routes.controller');


router.get('/', (0, _auth2.default)(), controller.index);

// senderid 6/6 message

// text box 160/ messages
// add group on enter create group
/**
 * POST groups name
 * GET groups id, name, count
 * PUT Groups/:id name (rename)
 */
// convert to csv link https://www.ablebits.com/office-addins-blog/2014/04/24/convert-excel-csv/
// upload csv button
// on csv file show 'File is selected'
//Blacklist number
/***
 * post blacklist number
 * get blacklists
 * delete blacklists/:id
 * download blacklists
 */
router.get('/routes', function (req, res, next) {

  // req.user.id
  return res.json({
    sender_id: 'MANJSE',
    routes: [{ id: 1, name: 'Transactional Route', balance: 50 }, { id: 2, name: 'Promotional Route', balance: 50 }, { id: 3, name: 'Sender ID Route', balance: 50 }, { id: 4, name: 'OTP', balance: 50 }]
  });
});

router.get('/routes/:routeId/senderIds', function (req, res, next) {
  // req.params.route_id
  return res.json([{ name: 'HIDIGE' }]);
});

router.delete('/routes/:routeId/senderIds', function (req, res, next) {
  // req.params.route_id
  return res.json({});
});

router.get('/users/sign', function (req, res, next) {
  // req.user.id
  return res.json({ status: 0, text: '@Digender' });
});

router.post('/users/sign', function (req, res, next) {
  // req.body.status | Boolean
  // req.body.text | String
  // req.user.id
  return res.status(200).end();
});

router.post('/users/signStatus', function (req, res, next) {
  // req.body.signStatus
  // req.user.id
  return res.status(200).end();
});

/***
 * Signature will affect your message credits by adding extra characters and space between SMS and signature.
 */

router.post('/sms1', function (req, res, next) {
  var SOURCES = {
    WEB: 1,
    MOBILE: 2,
    API: 3
    /**
     * req.body.route
     * sender_id_
     * mobile numbers(including csv file, group_id, mobilenumbers) (placeholder: Enter mobile numbers here
     1234567890, 0123456789, 9012345678
     8901234567
     7890123456)
     * unicode: false
     * flash: false
     * text: (placeholder: You are delivering crucial information. Keep it to-the-point.)
     * campaingn_id || campaign_name
     * sign: true
     * duplicate:true if lastmessage == current message
     * scheduled_on:  if route === promotional and 9 < currenttime > 9 throw error
     *
     */
    // industry dnd check
    // if user active continue
    // if route === promotional and 9 < currenttime > 9 return Promotional route works on on day time
    // packagemanager.check()
    // lastmessage == current message retur err 400 message: last==current
    // You messages exhaused. buy credits using http://parken.com/buy
    // template.get().then
    // messages.queue({ src: SOURCES.WEB })
    // cutting.manipulate()

  };res.status(400).json({ message: 'Your Sender Id blacklisted. Please use a different sender id' });
  return res.json({});
});

router.get('/groups/exportall', function (req, res, next) {
  return res.download('groups');
});

// get templates
router.get('/templates', function (req, res, next) {
  return res.json([{ id: 1, name: 'My First message' }, { id: 2, name: 'My Second message' }]);
});

//save draft
router.post('/drafts', function (req, res, next) {
  return res.status(201).json({ message: 'Message Save to drafts successfully' });
});

router.get('/groups/:id', function (req, res, next) {
  return res.json({ id: 1, name: 'tech team', count: 12 });
});

// get templates
router.get('/campaigns', function (req, res, next) {
  return res.json([{ id: 1, name: 'last campaign' }, { id: 2, name: 'new campaing team' }]);
});

// hide send sms button if route === promotional and 9 < currenttime > 9
// left bar scroll on overflow
// load previous and load current message
// on load previous help box turns 3rd state, with save draft button


// get templates
router.delete('/schedules', function (req, res, next) {
  return res.json({
    request_id: 44,
    scheduled_on: new Date(),
    campaign: 'one',
    route_id: 1,
    sender_id: 'digne',
    text: 'hello',
    percentage_done: 100,
    credits: 2,
    deducted: 2 // 0 if dnd
    // send now buttong
    // cancel button
  });
});

router.put('/schedules/:id/cancel', function (req, res, next) {
  return res.json();
});

module.exports = router;
//# sourceMappingURL=index.js.map
var express = require('express');
var router = express.Router();
const sign_in_controller = require('../controllers/signInController.js')
const sign_up_controller = require('../controllers/signUpController.js')
const profile_controller = require('../controllers/profileController.js')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage'/*, {username: 'TestUsername'}*/);
});

router.get('/download', function(req, res, next) {
  res.download("./dist/screen-translator-1.0.0.exe");
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
});

router.get('/sign_in', sign_in_controller.sign_in_get);
router.post('/sign_in', sign_in_controller.sign_in_post);

router.get('/sign_up', sign_up_controller.sign_up_get);
router.post('/sign_up', sign_up_controller.sign_up_post);

router.get('/profile', profile_controller.profile_get);
router.post('/profile', profile_controller.profile_post);

module.exports = router;

var express = require('express');
var router = express.Router();

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

router.get('/sign_in', function(req, res, next) {
  res.render('sign_in', {signing_up: false, username: "test"});
});

router.get('/sign_up', function(req, res, next) {
  res.render('sign_in', {signing_up: true});
});

module.exports = router;

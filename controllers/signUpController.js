const mysql = require('mysql');
const bcrypt = require('bcrypt');

exports.sign_up_get = function (req, res) {
	res.render('sign_in', {signing_up: true});
};

exports.sign_up_post = function (req, res) {
	
};
const mysql = require('mysql');
const sql_connection_settings = require('../sql_connection_settings.js');
const bcrypt = require('bcrypt');

exports.sign_in_get = function (req, res) {
	res.render('sign_in', {signing_up: false, username: "test"});
};

exports.sign_in_post = function (req, res) {
	
};
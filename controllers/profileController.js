const mysql = require('mysql');
const sql_connection_settings = require('../sql_connection_settings.js');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');

exports.profile_get = function (req, res) {
	res.render('profile', {username: "TestName"});
};

exports.profile_post = function (req, res) {
	//Validate
	res.render()
};
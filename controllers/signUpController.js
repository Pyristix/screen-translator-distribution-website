const mysql = require('mysql');
const sql_connection_settings = require('../sql_connection_settings.js');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');

exports.sign_up_get = function (req, res) {
	res.render('sign_in', {signing_up: true});
};

exports.sign_up_post = [
	body('username').trim().isLength({min: 1, max: 20}).withMessage('Username must be between 1-20 characters').escape(),
	body('password').trim().isLength({min: 8}).withMessage('Password must be at least 8 characters').isLength({max: 100}).withMessage('Password cannot be over 100 characters').escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		
		if(!errors.isEmpty())
			console.log(errors.errors[0].msg)
		
		else{
			const connection = mysql.createConnection(sql_connection_settings.connection_settings);
			connection.connect((err) => {
				if (err)
					console.log(err);
				console.log('Successfully connected to MySQL server')
			});
			connection.on('error', (err) => {
				console.log('MySQL Connection Error: ' + err.toString());
			});
			
			
			//TODO: 
			//Query for whether a username is taken
			//Function for displaying sign-up errors in the DOM
			//Create user in database if no errors, hashing password and also storing salt
			connection.query('SELECT', (error, results, fields) => {
				
			});
			
			
			connection.end((err) => {
				console.log('Connection Termination Error: ' + err.toString());
			});
			
			console.log("Success")
			res.render('sign_in', {signing_up: true});
		}
	}
]
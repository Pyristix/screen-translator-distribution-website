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
		if(!errors.isEmpty()){
			console.log(errors.errors[0].msg);
			res.render('sign_in', {signing_up: true, input_error: errors.errors[0].msg});
		}
		
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
			
			connection.query('SELECT * FROM `st_account_users` WHERE `username` = "' + req.body.username + '"', (error, results, fields) => {
				if(error){
					console.log(error);
					connection.end((err) => {
						if (err)
							console.log('Connection Termination Error: ' + err);
						console.log('SQL Connection Successfully Terminated')
					});
				}
				//If the username isn't taken...
				if(Object.keys(results).length == 0){
					//Generate hash salt
					bcrypt.genSalt(10, (err, salt) => {
						//Hash password using generated salt
						bcrypt.hash(req.body.password, salt, (err, hash) => {
							//Insert username, password hash, and hash salt into MySQL database
							connection.query('INSERT INTO st_account_users(username,password_hash,hash_salt) VALUES(?,?,?)', [req.body.username, hash, salt], (error, results, fields) => {
								if(error)
									console.log(error);
								console.log("Successfully created account")
								
								connection.end((err) => {
									if (err)
										console.log('Connection Termination Error: ' + err);
									console.log('SQL Connection Successfully Terminated')
								});
							})
						});
					});
					
					res.render('homepage');
				}
				else{
					console.log('Username already taken');
					connection.end((err) => {
						if (err)
							console.log('Connection Termination Error: ' + err);
						console.log('SQL Connection Successfully Terminated')
					});
					
					res.render('sign_in', {signing_up: true, input_error: "Username already taken"});
				}
			});
			
		}
	}
];
const mysql = require('mysql');
const sql_connection_settings = require('../sql_connection_settings.js');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');

exports.profile_get = function (req, res) {
	if(!req.session.username)
		res.redirect('/');
	else
		res.render('profile', {username: req.session.username});
};

exports.profile_post = [
	body('password').trim().isLength({min: 8}).withMessage('Password must be at least 8 characters').isLength({max: 100}).withMessage('Password cannot be over 100 characters').escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		
		if(!errors.isEmpty()){
			console.log(errors.errors[0].msg);
			res.render('profile', {username: req.session.username, input_error: errors.errors[0].msg});
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
			
			//Generate hash salt
			bcrypt.genSalt(10, (err, salt) => {
				//Hash password using generated salt
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					//Update password hash and hash salt in MySQL database
					connection.query('UPDATE st_account_users SET password_hash=?, hash_salt=? WHERE username=?', [hash, salt, req.session.username], (error, results, fields) => {
						if(error)
							console.log(error);
						console.log("Successfully changed password")
						
						connection.end((err) => {
							if (err)
								console.log('Connection Termination Error: ' + err);
							console.log('SQL Connection Successfully Terminated')
						});
					})
				});
			});
			res.redirect('/');
		}
	}
];
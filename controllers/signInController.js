const mysql = require('mysql');
const sql_connection_settings = require('../sql_connection_settings.js');
const bcrypt = require('bcrypt');

exports.sign_in_get = function (req, res) {
	if(req.session.username)
		res.redirect('/');
	else
		res.render('sign_in', {signing_up: false});
};

exports.sign_in_post = 	(req, res, next) => {
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
		//If the username exists...
		if(Object.keys(results).length != 0){
			bcrypt.compare(req.body.password, results[0].password_hash, (err, result) => {
				if(err)
					console.log(err)
				if(result){
					console.log("Successfully signed in: " + req.body.username);
					req.session.username = req.body.username;
					res.redirect('/');
				} 
				else 
					res.render('sign_in', {signing_up: false, input_error: "Password is incorrect"});
				
				connection.end((err) => {
					if (err)
						console.log('Connection Termination Error: ' + err);
					console.log('SQL Connection Successfully Terminated')
				});
			});
			
		}
		else{
			console.log("User doesn't exist");
			connection.end((err) => {
				if (err)
					console.log('Connection Termination Error: ' + err);
				console.log('SQL Connection Successfully Terminated')
			});
			
			res.render('sign_in', {signing_up: false, input_error: "User doesn't exist"});
		}
	});
}
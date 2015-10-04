var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var express = require('express');
var models = require('./model_manage');
var path = require('path');


module.exports = function(app) {	
	app.set('models', models); // just use app.get('models') to get models module	
	app.use(express.static(path.resolve('client-web')));
	app.use('/libs',express.static(path.join(__dirname, '../node_modules')));
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());	
	app.use(methodOverride());

}
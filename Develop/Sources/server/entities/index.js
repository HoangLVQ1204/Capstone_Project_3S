/**
 * Created by hoanglvq on 10/16/15.
 */
/**
 * Created by hoanglvq on 10/16/15.
 */
"use strict";

var fs          = require("fs");
var path        = require("path");
var Sequelize   = require("sequelize");
var config      = require('../config/config');
var globber     = require('../util/globber');


var sequelize = new Sequelize(config.db.url, {
	logging: false
});

var db = {};

sequelize.handler = function(data) {
	// console.log('handler', data);	
	if (data) {
		if (data instanceof Array) {
			if (data.length == 0)
				throw new Error('Result = empty');
			else if ((data.length == 1 || data.length == 2) && data[0] == 0) {
				throw new Error('Result is empty');
			}
		}
		console.log('handler case 1', data);
		return data;
	} else {
		console.log('handler case 2', data);
		throw new Error('Result is empty');
	}
};


globber.getGlobbedFiles('./entities/**/!(index.js)').forEach(function(routePath) {

   // console.log('get route:', path.resolve(routePath));

    var model = sequelize.import(path.resolve(routePath));
    db[model.name] = model;
});



Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


/*
create: null/undefined => Error
destroy: 0 => Error
update: Array.length => 
*/
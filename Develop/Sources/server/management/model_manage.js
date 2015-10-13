"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var config = require('../config/config');
var globber = require('../util/globber');

// var sequelize = new Sequelize(config.database, config.username, config.password, config);
console.log(config.db.url);
var sequelize = new Sequelize(config.db.url);

var db = {};

 //console.log('array:', globber.getGlobbedFiles('./api/*/models/*.js'));

globber.getGlobbedFiles('./models/*.js').forEach(function(routePath) { // rex

    console.log('get route:', path.resolve(routePath));

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

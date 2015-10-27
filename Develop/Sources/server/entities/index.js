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


var sequelize = new Sequelize(config.db.url);

var db = {};


globber.getGlobbedFiles('./entities/**/!(index.js)').forEach(function(routePath) {

   // console.log('get route:', path.resolve(routePath));

    var model = sequelize.import(path.resolve(routePath));
    db[model.name] = model;
});



//Object.keys(db).forEach(function(modelName) {
//    if ("associate" in db[modelName]) {
//        db[modelName].associate(db);
//    }
//});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


/**
 * Created by Cao Khanh on 13/11/2015.
 */
 var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');
    var get= function (req, res, next) {
    	return db.ward.getAllWard()
    		.then(function(ward){
            	res.status(200).json(ward);            
	        }, function(err) {
	            next(err);
	        });
    };
    return {
        getAllWard: get      
    }
}
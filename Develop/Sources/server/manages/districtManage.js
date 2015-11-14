/**
 * Created by Cao Khanh on 13/11/2015.
 */
 var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');
    var get= function (req, res, next) {
    	return db.district.getAllDistrict()
    		.then(function(district){
            	res.status(200).json(district);            
	        }, function(err) {
	            next(err);
	        });
    };
    return {
        getAllDistrict: get      
    }
}
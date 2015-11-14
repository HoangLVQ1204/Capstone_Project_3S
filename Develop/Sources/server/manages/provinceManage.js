/**
 * Created by Cao Khanh on 13/11/2015.
 */
 var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');


    var get= function (req, res, next) {
    	var districtModel = db.district;
    	var wardModel = db.ward;
    	return db.province.getAllProvince(districtModel,wardModel)
    		.then(function(province){
            	res.status(200).json(province);            
	        }, function(err) {
	            next(err);
	        });
    };
    return {
        getAllProvince: get      
    }
}
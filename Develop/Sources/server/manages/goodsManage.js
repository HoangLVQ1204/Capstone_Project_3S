/**
 * Created by Cao Khanh on 13/11/2015.
 */

var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');    

    var deleteGoods = function (req, res, next) {   
    	var gooodid = req.query.gooodid; 	
    	return db.goods.deleteGood(gooodid)
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
/**
 * Created by Cao Khanh on 13/11/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/provinceManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    // app.param('order_id', controller.params);

    app.route('/api/getProvince')
        .get(function (req,res,next) {
        	controller.getAllProvince().then(function(data){
        		res.status(200).json(data);  
        	})
        	.catch (function(err){
        		next(err);
        	})
        });

};
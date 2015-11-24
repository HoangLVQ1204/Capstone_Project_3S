
module.exports = function(app){

 	var reportCtrl = require('./../../manages/reportManage')(app);
	var authManage = require('./../../manages/authManage')(app);
	var config      = require('../../config/config');
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	// app.route('/api/admin/report/getOverView')
		// .get(controller.getOverView);
	app.route('/api/admin/report/orderCount')
		.get(reportCtrl.getOrderCount)
}
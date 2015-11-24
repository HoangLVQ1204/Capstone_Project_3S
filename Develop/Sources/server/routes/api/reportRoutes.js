
module.exports = function(app){

 	var reportCtrl = require('./../../manages/reportManage')(app);
	var authManage = require('./../../manages/authManage')(app);
	var config      = require('../../config/config');
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	// app.route('/api/admin/report/getOverView')
		// .get(controller.getOverView);
	app.route('/api/admin/report/orderCount')
		.get(reportCtrl.getOrderCount)

	app.route('/api/admin/report/moneyCount')
		.get(reportCtrl.getMoneyCount)

	app.route('/api/admin/report/storeOrderCount')
		.get(reportCtrl.getCountOrdersDoneOrFail)
	app.route('/api/admin/report/overView')
		.get(reportCtrl.getOverView)
}
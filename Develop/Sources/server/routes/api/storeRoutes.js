
module.exports = function(app){

 	var controller = require('./../../manages/storeController')(app);

 	app.param('storeid', controller.params);

	app.route('/api/store/getAllLedger')
		.get(controller.getAllLedger);

	app.route('/api/store/getLatestAutoAccountDate')
		.get(controller.getLatestAutoAccountDate);


	app.route('/api/store/postNewLedger')
		.post(controller.postNewLedger);

	app.route('/api/store/getTotalFee')
		.get(controller.getTotalFee);

	app.route('/api/store/getTotalCoD')
		.get(controller.getTotalCoD);

    app.route('/api/store')
    	.get(controller.get)
    	.post(controller.post);

    app.route('/api/store/:storeid')
    	.get(controller.getOne)
    	.put(controller.put)
    	.delete(controller.del);

	app.route('/api/store/getLatestLedgerOfStore/:storeid')
		.get(controller.getLatestLedgerOfStore);

	app.route('/api/store/updateLedgerForOrder/:storeid')
		.put(controller.updateLedgerForOrder);
}
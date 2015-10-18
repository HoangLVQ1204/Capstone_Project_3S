
module.exports = function(app){

 	var controller = require('./../../manages/storeController')(app);

 	app.param('storeid', controller.params);

    app.route('/api/store')
    	.get(controller.get)
    	.post(controller.post);

    app.route('/api/store/:storeid')
    	.get(controller.getOne)
    	.put(controller.put)
    	.delete(controller.del);

	app.route('/api/store/getBalance/:storeid')
		.get(controller.getBalance)

	app.route('/api/store/getLedger/:storeid')
		.get(controller.getLedger)


}
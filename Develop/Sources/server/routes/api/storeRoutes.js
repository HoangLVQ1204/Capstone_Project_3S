
module.exports = function(app){

 	var controller = require('./../../manages/storeManage')(app);
	var authManage = require('./../../manages/authManage')(app);
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	app.param('storeid', controller.params);

	app.route('/api/store/getAllLedger')
		.get(controller.getAllStoreWithLedger);

	app.route('/api/store/getLatestAutoAccountDate')
		.get(controller.getLatestAutoAccountDate);

	app.route('/api/store/getNewStoreOwnerID')
		.get(controller.createStoreOwnerID);

	app.route('/api/store/getNewStoreID')
		.get(checkAll,function(req,res,next){
			controller.createStoreID().then(function(data){
				res.status(200).json(data);
			})
				.catch(function(err){
					next(err);
				})
		});

	app.route('/api/store/postNewLedger')
		.post(checkAll,function(req,res,next){
			var newLedger = req.body;
			controller.postNewLedger(newLedger).then(function(data){
				res.status(201).json(data);
			})
				.catch(function(err){
					next(err);
				})
		});

	app.route('/api/store/getTotalFee')
		.get(controller.getTotalFee);

	app.route('/api/store/getTotalCoD')
		.get(controller.getTotalCoD);

	app.route('/api/store/getAllStoreToCheck')
		.get(controller.getAllStoreToCheck);

	app.route('/api/store/addManageStore')
		.post(controller.postNewManageStore);

    app.route('/api/store')
    	.get(controller.get)
    	.post(function(req,res,next){
			var newStore = req.body;
			controller.postNewStore(newStore).then(function(data){
				res.status(201).json(data);
			})
				.catch(function(err){
					next(err);
				})
		});

    app.route('/api/store/:storeid')
    	.get(controller.getOne)
    	.put(controller.put)
    	.delete(controller.del);

	app.route('/api/store/getLatestLedgerOfStore/:storeid')
		.get(checkAll,function(req,res,next){
			var storeid = req.store.storeid;
			controller.getLatestLedgerOfStore(storeid).then(function(data){
				res.status(200).json(data);
			})
			.catch(function(err){
				next(err);
			})
		});

	app.route('/api/store/updateLedgerForOrder/:storeid')
		.put(checkAll,function(req,res,next){
			var storeid = req.store.storeid;
			controller.updateLedgerForOrder(storeid).then(function(data){
				res.status(201).json(data);
			})
			.catch(function(err){
				next(err);
			})
		});

	app.route('/api/getAllStoreName')
		.get(checkAll,function(req,res,next){
			var listStoreId = req.user.stores;
			controller.getAllStoreName(listStoreId).then(function(data){
				res.status(200).json(data);
			})
			.catch (function(err){
				next(err);
			})
		});

	app.route('/api/getInactiveStore')
		.get(controller.getAllInactiveStore);

	app.route('/api/storeDetail/:storeid')
		.get(checkAll,function(req,res,next){
			var storeid = req.store.storeid;
			controller.getStoreDetail(storeid).then(function(data){
				res.status(200).json(data);
			})
			.catch(function(err){
				next(err);
			})
		});

	app.route('/api/storeDetail')
		.get(checkAll,function(req,res,next) {
			var storeid = req.user.stores[0].storeid
			controller.storeGetStoreDetail(storeid).then(function(data){
				res.status(200).json(data);
			})
			.catch(function(err){
				next(err);
			})
		});

	app.route('/api/ledgerList')
		.get(controller.getAllLedger);

	app.route('/api/getLedgerOfStore/:storeid/:perioddate')
		.get(controller.getLedgerOfStore)

	app.route('/api/store/ledger/getLedgerList')
		.get(checkAll,function(req,res,next) {
			var storeId = req.user.stores[0].storeid;
			controller.storeGetAllLedger(storeId).then(function(data){
				res.status(200).json(data);
			})
				.catch(function(err){
					next(err);
				})
		})
};
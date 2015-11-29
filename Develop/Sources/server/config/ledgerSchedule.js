var cron           = require('node-schedule');// Job schedule
var moment         = require('moment');
module.exports = function(app) {
	var db = app.get('models');

	var autoPayment = function () {
		var rule = new cron.RecurrenceRule();
		rule.dayOfWeek = [0];
		rule.hour = 23;
		rule.minute = 59;
		cron.scheduleJob(rule, function(){
			var date, totalcod, totaldelivery;
			var storeList;
			var datePromise = db.generalledger.getLatestAutoAccountDate()
					.then(function (ledger) {
						if (ledger != null)
							date = new Date(ledger.paydate);
						else date = new Date("October 24, 2015 23:59:00");
						//console.log(date);
					});
			datePromise.then(function(){
				db.store.getAllStores()
					.then(function (list) {
						console.log(date);
						storeList = list;
						var promise = [];
						storeList.map(function (store) {
							promise.push(db.order.getTotalShipFeeOfStore(store.storeid, date)
								.then(function (fee) {
									totaldelivery = parseInt(fee)?parseInt(fee):0;
									//console.log(store.storeid, totaldelivery, date)
								}));
							promise.push(db.order.getTotalShipCoDOfStore(store.storeid, date)
								.then(function (cod) {
									totalcod = parseInt(cod)?parseInt(cod):0;
								}));
							
							Promise.all(promise).then(function () {
								var ledger = new Object();
								ledger['storeid'] = store.storeid;
								ledger['paydate'] = new Date(Date.now());
								ledger['totaldelivery'] = totaldelivery;
								ledger['totalcod'] = totalcod;
								ledger['balance'] = totaldelivery - totalcod;
								ledger['note'] = 'Auto payment from ' + moment(date).format('DD/MM/YYYY') + ' to ' + moment(ledger['paydate']).format('DD/MM/YYYY') ;
								db.generalledger.postNewLedger(ledger)
									.then(function (gledger) {
										console.log('Auto update ledger of store ' + store.storeid);
									})
							})
						})
					})
			})





		});
	}

	return {
		autoPayment: autoPayment
	}
};


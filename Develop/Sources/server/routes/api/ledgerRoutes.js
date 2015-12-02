/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/ledgerManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

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

}
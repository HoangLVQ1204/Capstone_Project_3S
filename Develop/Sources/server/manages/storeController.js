var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');
    //db.generalledger.belongsTo(db.store);


    var params = function(req, res, next, storeid) {
        return db.store.getOneStore(storeid)
        .then(function(store) {
            if (store) {
                req.store = store;
                next();
            } else {
                next(new Error('No user with that id'));
            }
        }, function(err) {
            next(err);
        });
    }; 

    var get = function(req, res, next) {
        return db.store.getAllStores()
        .then(function(store) {
                res.status(200).json(store);
        }, function(err) {
            next(err);
        })
    };

    var getOne = function(req, res, next) {
        res.status(200).json(req.store.toJSON());
    };
    //
    var post = function(req, res, next) {
        var newUser = req.body;
       // newUser.Token = newUser.storeid;
        return db.store.postOneStore(newStore)
            .then(function(store) {
                res.status(201).json(store);
            }, function(err) {
                next(err);
            });
    };
    //
    var put = function(req, res, next) {
        var store = req.store;
        var update = req.body;
        _.merge(store, update);
        return db.store.putStore(store)
            .then(function(saved) {
                if (saved) {
                    res.status(201).json(store);
                } else {
                    next(new Error('Cannot save user'));
                }
            }, function(err) {
                next(err);
            });
    };
    //
    var del = function(req, res, next) {
        return db.store.deleteStore(req.store)
            .then(function() {
                res.status(200).json(req.store);
            }, function(err) {
                next(err);
            })
    };

    var getLatestLedgerOfStore = function(req, res, next){
        return db.generalledger.getLatestLedgerOfStore(req.store.storeid)
            .then(function(ledger) {
                res.status(200).json(ledger);
            }, function(err) {
                next(err);
            })
    };

    var getAllLedger = function(req, res, next){
        return db.store.getStoreLatestTotal(db.generalledger, db.bannedhistorylog, db.managestore, db.user)
            .then(function(store) {
                res.status(200).json(store);
            }, function(err) {
                next(err);
            })
    };

    var getTotalFee = function(req, res, next){
        var storeList, paydate;
        var promises = [];
        return db.store.getAllStores()
            .then(function(store) {
                storeList = store;
            })
            .then(function () {
               db.generalledger.getLatestAutoAccountDate()
                    .then(function(total) {
                        paydate = total.paydate;
                    }, function(err) {
                        next(err);
                    })
            .then(function () {
                var fee = [];
                        storeList.map(function(item){
                            promises.push(db.order.getTotalShipFeeOfStore(item.storeid, paydate).then(function (total) {
                                var newFee = new Object();
                                if (isNaN(total))  newFee.totalFee = 0;
                                else newFee.totalFee  = total;
                                fee.push(newFee);
                    }))
                })
                Promise.all(promises).then(function() {
                    // _.merge(fee, storeList);
                    res.status(200).json(fee);
                }, function (err) {
                    res.status(400).json(err);
                })
            })
            })
    };

    var getTotalCoD = function(req, res, next){
        var storeList, paydate;

        return db.store.getAllStores()
            .then(function(store) {
                storeList = store;
            })
            .then(function () {
                db.generalledger.getLatestAutoAccountDate()
                    .then(function(total) {
                        paydate = total.paydate;
                    }, function(err) {
                        next(err);
                    })
                    .then(function () {
                        var promises = [];
                        var cod = [];
                        storeList.map(function(item){
                            promises.push(db.order.getTotalShipCoDOfStore(item.storeid,paydate).then(function (total) {
                                var newFee = new Object();
                                if (isNaN(total))  newFee.totalCoD = 0;
                                else newFee.totalCoD  = total;
                                cod.push(newFee);
                            }))
                        })
                        Promise.all(promises).then(function() {
                            // _.merge(fee, storeList);
                            res.status(200).json(cod);
                        }, function (err) {
                            res.status(400).json(err);
                        })
                    })
            })
    };

    var getLatestAutoAccountDate = function(req, res, next){
        var store = req.store;
        return db.generalledger.getLatestAutoAccountDate()
            .then(function(total) {
                res.status(200).json(total.paydate);
            }, function(err) {
                next(err);
            })
    };

    var updateLedgerForOrder = function(req, res, next){
        var store = req.store;
        var ledger;
        // newUser.Token = newUser.storeid;
        return db.generalledger.getLatestAutoAccountWithStoreID(store.storeid)
            .then(function(total) {
                ledger = total;
            }, function(err) {
                next(err);
            }).then(function () {
                db.order.updateLedgerForOrder(store.storeid, ledger.paydate, ledger.ledgerid)
                    .then(function(ledger) {
                        res.status(201).json(ledger);
                    }, function(err) {
                        next(err);
                    });
            })

    };

    var postNewLedger = function(req, res, next){
        var newLedger = req.body;
        // newUser.Token = newUser.storeid;
        return db.generalledger.postNewLedger(newLedger)
            .then(function(ledger) {
                res.status(201).json(ledger);
            }, function(err) {
                next(err);
            });
    };

    //KhanhKC
    var getStoreName = function(req,res,next){
        var listStoreID = [];
         _.each(req.user.stores, function(store){
                listStoreID.push(store.storeid);
          });       
        db.store.getListStoreName(listStoreID)
            .then(function (storeRs) {
                res.status(200).json(storeRs);
            }, function () {
                next(new Error("Can not find store name!"))
            });

    };

    var getStoreDetail = function(req,res,next){

        db.store.getStoreDetail(req.store.storeid, db.managestore, db.user, db.profile)
            .then(function (store) {
                res.status(200).json(store);
            }, function () {
                next(new Error("Can not find store name!"))
            });

    };

    var getAllInactiveStore = function(req,res,next){

        db.store.getAllInactiveStore(db.managestore, db.user, db.profile)
            .then(function (store) {
                res.status(200).json(store);
            }, function () {
                next(new Error("Can not find store name!"))
            });

    };

    var getAllStores = function(){
        return db.store.getAllStores().then(function(rs){
            return rs;
        })
    }

       return {
            get: get,
            getOne: getOne,
            post: post,
            put: put,
            del: del,
            params: params,
            getLatestLedgerOfStore: getLatestLedgerOfStore,
            getAllLedger: getAllLedger,
            getTotalFee: getTotalFee,
            getTotalCoD: getTotalCoD,
            getLatestAutoAccountDate: getLatestAutoAccountDate,
            postNewLedger: postNewLedger,
            updateLedgerForOrder: updateLedgerForOrder,
            getAllStoreName: getStoreName,
            getStoreDetail: getStoreDetail,
            getAllInactiveStore: getAllInactiveStore,
            getAllStores: getAllStores
    }
}

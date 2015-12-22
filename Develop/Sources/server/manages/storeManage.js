var _ = require('lodash');
var gmapUtil = require('../util/googlemapUtil');
module.exports = function(app) {

    var db = app.get('models');
    var server = app.get('io');
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
    var postNewStore = function(newStore) {
       // console.log(newStore.address);
        //return
        // console.log('postNewStore:39', newStore);        
        if (newStore == null) throw new Error('Null Exception');

        return gmapUtil.getLatLng(newStore.address).then(function (map) {
            newStore['latitude'] = map.latitude+"";
            newStore['longitude'] = map.longitude+"";
            //console.log('MAP', newStore)
        }, function(err) {
            throw err;
        }).then(function () {
            server.socket.addStore({
                storeID: newStore.storeid,
                latitude: newStore.latitude,
                longitude: newStore.longitude,
                geoText: newStore.address
            });

            return db.store.postOneStore(newStore)
                .then(function(store) {
                    //console.log(store);
                    return store;
                });
        }, function(err) {
             throw err;
        })
    };
    //
    var put = function(req, res, next) {
        var store = req.store;
        var update = req.body;
        _.merge(store, update);
        return db.store.updateStore(store)
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

    var getLatestLedgerOfStore = function(storeid){
        console.log('getLatestLedgerOfStore:82', storeid);
        if (storeid == null) throw new Error('Null Exception');
        return db.generalledger.getLatestLedgerOfStore(storeid)
            .then(function(ledger) {
                return ledger;
            }, function(err) {
                throw err;
            })
    };

    var getAllStoreWithLedger = function(req, res, next){
        return db.store.getAllStoreWithLedger(db.generalledger, db.bannedhistorylog, db.managestore, db.user)
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
                                newFee.storeid = item.storeid;
                                fee.push(newFee);
                    }))
                })
                Promise.all(promises).then(function() {
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
                                newFee.storeid = item.storeid;
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
                res.status(200).json(!!total ? total.paydate : null);
            }, function(err) {
                next(err);
            })
    };

    var updateLedgerForOrder = function(storeid){
        var ledger;
        if (storeid == null) throw new Error('Null Exception');
        return db.generalledger.getLatestAutoAccountWithStoreID(storeid)
            .then(function(total) {
                ledger = total;
            }, function(err) {
                throw err;
            }).then(function () {
                if (ledger != null)
                db.order.updateLedgerForOrder(storeid, ledger.paydate, ledger.ledgerid)
                    .then(function(ledger) {
                        return ledger;
                    }, function(err) {
                        throw err;
                    });
            })

    };

    var postNewLedger = function(newLedger){
        if (newLedger == null) throw new Error('Null Exception');
            return db.generalledger.postNewLedger(newLedger)
                .then(function(ledger) {
                    //console.log(ledger);
                    return ledger;
                }, function(err) {
                    throw err;
                });
    };

    /*
        By KhanhKC
        This function is use to get all name of list storeid
    */
    function getStoreName (listStoreId){
        var listStoreID = [];
        _.each(listStoreId, function(store){
            listStoreID.push(store.storeid);
        });       
        return db.store.getListStoreName(listStoreID)
        .then(function (storeRs) {
             return storeRs;
        }, function (err) {
            throw err
        });
    }

    var getStoreDetail = function(storeid){
        if (storeid == null) throw new Error('Null Exception');
        return db.store.getStoreDetail(storeid, db.managestore, db.user, db.profile)
            .then(function (store) {
                return store;
            }, function (err) {
                throw err;
            });

    };

    var getAllInactiveStore = function(req,res,next){

        return db.store.getAllInactiveStore(db.managestore, db.user, db.profile)
            .then(function (store) {
                res.status(200).json(store);
            }, function () {
                next(new Error("Can not find store name!"))
            });

    };


/*
    By KhanhKC
    This function is use to get info of a store and info of store's manager
*/
    function storeGetStoreDetail(storeid) {
        return db.store.getStoreDetail(storeid, db.managestore, db.user, db.profile)
            .then(function (store) {
                return store;
            }, function (err) {
                throw err;
            });  
    };

    //function create new shipperid
    var createStoreOwnerID = function(req, res, next){
        var isExisted = false;
        do
        {
            var str = "000000" + parseInt(Math.random()*1000000);
            var formatStr = str.substr(str.length - 6);
            var newStoreOwnerID = "ST" + formatStr;
            //console.log(newShipperID);
            db.user.findUserByUsername(newStoreOwnerID)
                .then(function(storeowner){
                    //console.log(newShipperID, shipper);
                    if(!storeowner){
                        //console.log('AAA');
                        isExisted = true;
                        res.status(200).json(newStoreOwnerID);
                    }
                },function(err){
                    //console.log(newShipperID, shipper);
                    res.status(400).json("Can not get new shipperid");
                });
        } while (isExisted);
    };

    var createStoreID = function(){
        var isExisted = false;
        var promise;
        do
        {
            var str = "000" + parseInt(Math.random()*1000000);
            var formatStr = str.substr(str.length - 3);
            var newStoreID = "STR" + formatStr;
            //console.log(newShipperID);
            promise = db.store.getOneStore(newStoreID)
                .then(function(store){
                    //console.log(newShipperID, shipper);
                    if(!store){
                        //console.log('AAA');
                        isExisted = true;
                        return newStoreID;
                    }
                },function(err){
                    throw err;
                });
        } while (isExisted);

        return promise;
    };

    var postNewManageStore = function(req, res, next) {
        var newManageStore = req.body;
        //console.log(newManageStore);
        // newUser.Token = newUser.storeid;
        return db.managestore.addNewManageStore(newManageStore)
            .then(function(newManageStore) {
                res.status(201).json(newManageStore);
            }, function(err) {
                next(err);
            });
    };

    var getAllStores = function(){
        return db.store.getAllStores().then(function(rs){
            return rs;
        })
    };

    var getAllLedger = function (req, res, next) {

        return db.generalledger.getAllLedger(db.store, db.order)
            .then(function (ledgerList) {
                res.status(200).json(ledgerList);
            }, function (err) {
                next(err);
            })
    };

    var getLedgerOfStore = function (req, res, next) {
        var storeid = req.params.storeid;
        var perioddate = req.params.perioddate;

        if (req.params.perioddate != 'null')
            perioddate = new Date(perioddate);

        return db.generalledger.getLatestAutoAccountDate()
            .then(function (ledger) {
                if (ledger != null)
                    db.generalledger.getLedgerOfStore(db.store, storeid, perioddate, ledger.paydate)
                        .then(function (ledgerList) {
                            res.status(200).json(ledgerList);
                        }, function (err) {
                            next(err);
                        })
            }, function (err) {
                next(err);
            })
    };

    /*
     By KhanhKC
     This function is use to get all transaction of a store
     */
    // var storeGetAllLedger = function (req, res, next) {
    //     var storeId = req.user.stores[0].storeid;
    //     db.generalledger.storeGetAllLedger(storeId)
    //     .then(function(list){
    //         res.status(200).json(list);
    //     }, function(err) {
    //         next(err);
    //     });
    // };

    function storeGetAllLedger(storeid){
        return db.generalledger.storeGetAllLedger(storeid)
            .then(function(list){
                return list;
            }, function(err) {
                throw err;
            });
    };

    var getAllStoreToCheck = function(req,res,next){

        db.store.getAllStoreToCheck()
            .then(function(list){
                res.status(200).json(list);
            },function(err){
                next(err);
            });
    };

       return {
            get: get,
            getOne: getOne,
            postNewStore: postNewStore,
            put: put,
            del: del,
            params: params,
            getLatestLedgerOfStore: getLatestLedgerOfStore,
            getAllStoreWithLedger: getAllStoreWithLedger,
            getTotalFee: getTotalFee,
            getTotalCoD: getTotalCoD,
            getLatestAutoAccountDate: getLatestAutoAccountDate,
            postNewLedger: postNewLedger,
            updateLedgerForOrder: updateLedgerForOrder,
            getAllStoreName: getStoreName,
            getStoreDetail: getStoreDetail,
            getAllInactiveStore: getAllInactiveStore,
            storeGetStoreDetail: storeGetStoreDetail,
            createStoreOwnerID: createStoreOwnerID,
            createStoreID: createStoreID,
            postNewManageStore: postNewManageStore,
            getAllStores: getAllStores,
            getAllLedger: getAllLedger,
            getLedgerOfStore: getLedgerOfStore,
            storeGetAllLedger : storeGetAllLedger,
            getAllStoreToCheck: getAllStoreToCheck
    }
}

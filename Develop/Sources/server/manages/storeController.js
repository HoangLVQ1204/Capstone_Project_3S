var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');
    db.store.hasMany(db.generalledger,  {foreignKey : 'storeid'});

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
        //console.log(req.user.username, req.body);

        _merge(store, update);

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

    var getBalance = function(req, res, next){
        return db.generalledger.getBalance(req.store.storeid)
            .then(function(ledger) {
                console.log(ledger.paydate);
                res.status(200).json(ledger.toJSON());
            }, function(err) {
                next(err);
            })
    };

    var getLedger = function(req, res, next){
        return db.store.getAllStoreLedger(req.store.storeid)
            .then(function(store) {
                res.status(200).json(store);
            }, function(err) {
                next(err);
            })
    };

    return {
        get: get,
        getOne: getOne,
        post: post,
        put: put,
        del: del,
        params: params,
        getBalance: getBalance,
        getLedger: getLedger,
    }
}


/*
{
  "GET /users": {
    "desc": "returns all users",
    "response": "200 application/json",
    "data": [{}, {}, {}]
  },

  "GET /users/:id": {
    "desc": "returns one user respresented by its id",
    "response": "200 application/json",
    "data": {}
  },

  "POST /users": {
    "desc": "create and returns a new user uisng the posted object as the user",
    "response": "201 application/json",
    "data": {}
  },

  "PUT /users/:id": {
    "desc": "updates and returns the matching user with the posted update object",
    "response": "200 application/json",
    "data": {}
  },

  "DELETE /users/:id": {
    "desc": "deletes and returns the matching user",
    "response": "200 application/json",
    "data": {}
  }
}
*/
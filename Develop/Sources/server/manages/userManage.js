var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');

    var params = function(req, res, next, username) {
        return db.user.findUserByUsername(username)
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                next(new Error('No user with that username'));
            }
        }, function(err) {
            next(err);
        });
    };
    
    var get = function(req,res,next) {        
        var user = req.user;
        db.user.getAllUsers()
            .then(function(users) {
                res.status(200).json(users);
            }, function(err) {
                next(err);
            });
    };

    var getProfileUser = function(req,res,next){
        var username = req.user.username;
        db.profile.getProfileUser(username)
            .then(function(user){
                res.status(200).json(user);
            },function(err){
                next(err);
            });
    }

    var createStoreOwnerAccount = function(req,res,next){
        var dataUser = req.body.dataUser;


    }

    return {
        get: get,
        getProfileUser: getProfileUser,
        params: params,
        createStoreOwnerAccount: createStoreOwnerAccount
    }
}


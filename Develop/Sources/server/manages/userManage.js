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
    };

    var paramUsername = function(req, res, next, username) {
        //console.log(shipperid)
        return db.user.findUserDetail(username, db.profile)
            .then(function(user) {
                if (user) {
                    req.user = user;
                    next();
                } else {
                    next(new Error('No user with that id'));
                }
            }, function(err) {
                next(err);
            });
    };

    var getUserDetail = function(req, res, next) {
        res.status(200).json(req.user.toJSON());
    };

    var putUser = function (req, res, next) {
        var curUser = req.user.toJSON();
        var newUser = req.body;
        //console.log(curUser.toJSON());
        //console.log(newUser);

        _.merge(curUser, newUser);

        delete curUser.profile;
        //console.log(curUser)
        return db.user.putUser(curUser)
            .then(function(user){
                res.status(201).json(user);
            },function(err){
                next(err);
            });
    };

    var putProfile = function (req, res, next) {
        var curUser = req.user.profile.toJSON();
        var newUser = req.body;
        //console.log(curUser);
        //console.log(newUser);

        _.merge(curUser, newUser);

        //delete curUser.profile;
        return db.profile.updateProfile(curUser)
            .then(function(user){
                res.status(201).json(user);
            },function(err){
                next(err);
            });
    };

   var createStoreOwnerAccount = function(req,res,next){
        var dataUser = req.body.dataUser;


    }

    //function add new Shipper to system
    var addNewUser = function(req, res, next){
        var user = req.body;
        db.user.addNewUser(user.account)
            .then(function(){
                db.profile.addNewProfile(user.profile)
                    .then(function(profile){
                        res.status(201).json(profile);
                    },function(err){
                        //console.log(newShipperID, shipper);
                        res.status(400).json("Can not add new profile");
                    });
            },function(err){
                //console.log(newShipperID, shipper);
                res.status(400).json("Can not add new user");
            });

    };

    return {
        get: get,
        getProfileUser: getProfileUser,
        params: params,
        createStoreOwnerAccount: createStoreOwnerAccount,
        paramUsername: paramUsername,
        getUserDetail: getUserDetail,
        putUser: putUser,
        putProfile: putProfile,
        addNewUser: addNewUser
    }
}


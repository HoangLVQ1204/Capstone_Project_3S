var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');
    var server = app.get('io');

    var params = function(req, res, next, username) {
        return db.user.findUserByUsername(username)
        .then(function(user) {
            if (user) {
                req.userRequest = user;
                next();
            } else {
                next(new Error('No user with that username'));
            }
        }, function(err) {
            next(err);
        });
    };
    
    var get = function(req,res,next) {        
        var user = req.userRequest;
        db.user.getAllUsers()
            .then(function(users) {
                res.status(200).json(users);
            }, function(err) {
                next(err);
            });
    };

    var getProfileUser = function(req,res,next){
        var username = req.userRequest.username;
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
                    req.userRequest = user;
                    next();
                } else {
                    next(new Error('No user with that id'));
                }
            }, function(err) {
                next(err);
            });
    };

    var getUserDetail = function(req, res, next) {
        res.status(200).json(req.userRequest.toJSON());
    };

    var putUser = function (req, res, next) {
        var curUser = req.userRequest.toJSON();
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
        console.log(req.userRequest.toJSON());
        var curUser = {};
        if (req.userRequest.profile)
            curUser = req.userRequest.profile.toJSON();
        var newUser = req.body;
        //console.log(curUser);
        //console.log(newUser);

        _.merge(curUser, newUser);
        console.log('putProfile', curUser, newUser);

        //delete curUser.profile;
        return db.profile.updateProfile(curUser)
            .then(function(user){
                res.status(201).json(user);
            },function(err){
                next(err);
            });
    };

    //function add new Shipper to system
    var addNewUser = function(user){
        // console.log('addNewUser', user);
        if (user == null) throw new Error('Null Exception');
        server.socket.addShipper({ 
            shipperID: user.account.username, 
            isConnected: false 
        });
        user['account']['logintime'] = new Date();
        user['account']['password'] = user['account']['username'];

            return db.user.addNewUser(user.account)
                .then(function(){
                    return db.profile.addNewProfile(user.profile)
                        .then(function(profile){
                            return profile;
                        });
                },function(err){
                    throw err;
                });

    };

    return {
        get: get,
        getProfileUser: getProfileUser,
        params: params,
        paramUsername: paramUsername,
        getUserDetail: getUserDetail,
        putUser: putUser,
        putProfile: putProfile,
        addNewUser: addNewUser
    }
}


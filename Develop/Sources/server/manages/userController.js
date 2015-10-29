var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');

    var params = function(req, res, next, user_id) {
        return db.user.findUserByUsername(user_id)
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

    var get = function(req,res,next) {
        var user = req.user;
        console.log(user);
        return db.user.getAllUsers()
            .then(function(users) {
                res.status(200).json(users);
            }, function(err) {
                next(err);
            })
    };

    //var get = function(req,res,next) {
    //    return db.users.getAllUsers()
    //    .then(function(users) {
    //            return users;
    //    }, function(err) {
    //        next(err);
    //    })
    //};


    var getOne = function(req, res, next) {
        res.status(200).json(req.user.toJSON());
    };
    //
    var post = function(req, res, next) {
        var newUser = req.body;
        newUser.Token = newUser.Username;
        return db.user.postOneUser(newUser)
            .then(function(user) {
                res.status(201).json(user);
            }, function(err) {
                next(err);
            });
    };
    //
    var put = function(req, res, next) {
        var user = req.user;
        var update = req.body;
        //console.log(req.user.username, req.body);

        user.username = update.username;
        user.password = update.password;

        return db.user.putUser(user)
            .then(function(saved) {
                if (saved) {
                    res.status(201).json(user);
                } else {
                    next(new Error('Cannot save user'));
                }
            }, function(err) {
                next(err);
            });
    };
    //
    var del = function(req, res, next) {
        return db.user.deleteUser(req.user)
            .then(function() {
                res.status(200).json(req.user.toJSON());
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
        params: params
    }
}


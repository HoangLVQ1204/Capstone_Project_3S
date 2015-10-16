var _ = require('lodash');

module.exports = function(app) {

    var db = app.get('models');

    var params = function(req, res, next, user_id) {
        return db.users.getOneUser(user_id)
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

    var get = function(next) {
        return db.users.getAllUsers()
        .then(function(users) {
                return users;
        }, function(err) {
            next(err);
        })
    };


    var getOne = function(req, res, next) {
        res.status(200).json(req.user.toJSON());
    };
    //
    var post = function(req, res, next) {
        var newUser = req.body;
        newUser.Token = newUser.Username;
        return db.users.postOneUser(newUser)
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

        return db.users.putUser(user)
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
        return db.users.deleteUser(req.user)
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
var _ = require('lodash');

module.exports = function(app) {    
    var db = app.get('models');    
    var params = function(req, res, next, user_id) {        
        db.User.findOne({
            attributes: ['UserId', 'Username', 'Role'],
            where: {
                'UserId': user_id,
                'Status': 'B1'
            }
        }).then(function(user) {
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

    var get = function(req, res, next) {
        db.User.findAll({
            attributes: ['UserId', 'Username', 'Role'],
            where: {
                'Status': 'B1'
            }
        })
        okReturn()
        .then(function(users) {
            res.status(200).json(users.map(function(user) {
                return user.toJSON();
            }));
        }, function(err) {
            next(err);
        })        
    };

    var getOne = function(req, res, next) {
        res.status(200).json(req.user.toJSON());
    };  

    var post = function(req, res, next) {
        var newUser = req.body;
        newUser.Token = newUser.Username;
        db.User.build(newUser)
            .save()
            .then(function(user) {
                res.status(201).json({
                    UserId: user.getDataValue('UserId'),
                    Username: user.getDataValue('Username'),
                    Role: user.getDataValue('Role')
                });
            }, function(err) {
                next(err);
            });
    };

    var put = function(req, res, next) {
        var user = req.user;
        var update = req.body;

        _.merge(user, update);        
        user.save()
            .then(function(saved) {
                if (saved) {                
                    res.status(201).json({
                        UserId: saved.getDataValue('UserId'),
                        Username: saved.getDataValue('Username'),
                        Role: saved.getDataValue('Role')
                    });
                } else {
                    next(new Error('Cannot save user'));
                }
            }, function(err) {
                next(err);
            });
    };

    var del = function(req, res, next) {
        req.user.destroy({ force: true })
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


var okReturn = function(){
    return "OKKKKKK";
}
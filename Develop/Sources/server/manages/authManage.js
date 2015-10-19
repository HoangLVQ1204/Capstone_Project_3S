/**
 * Created by hoanglvq on 10/17/15.
 */
var jwt         = require('jsonwebtoken');
var expressJwt  = require('express-jwt');
var config      = require('../config/config');
var checkToken  = expressJwt({ secret: config.secrets.jwt });

module.exports  = function(app){
    var db = app.get('models');

    var decodeToken = function(){
      return function(req,res,next){

          if(req.query && req.query.hasOwnProperty('access_token')){
              req.headers.authorization = 'Bearer' + req.query.access_token;
          }

          checkToken(req,res,next);
      }
    };

    var verifyUser = function(){
        return function(req,res,next){
            var userName = req.body.Username;
            var passWord = req.body.Passwork;

            if(!userName || !password) {
                res.status(400).send('You need a username and password');
                return;
            }

            db.users.findUser(userName)
                .then(function(user){
                    if(!user){
                        res.status(401).send('No user with the given username');
                    }else{
                        if(!user.authenticate(passWord)){
                            res.status(401).send('Wrong password');
                        }else{
                            req.user = user;
                            next();
                        }
                    }
                },function(err){
                   next(err);
                });
        }
    }
}
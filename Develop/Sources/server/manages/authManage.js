/**
 * Created by hoanglvq on 10/17/15.
 */
var jwt         = require('jsonwebtoken');
var expressJwt  = require('express-jwt');
var config      = require('../config/config');
var checkToken  = expressJwt({ secret: config.secrets.jwt });

module.exports  = function(app){
    var db = app.get('models');

    var checkToken = function(){
      return function(req,res,next){
          console.log(req.query);
          if(req.query && req.query.hasOwnProperty('access_token')){
              req.headers.authorization = 'Bearer' + req.query.access_token;
          }
          console.log("TOKEN",req.query.access_token);
          checkToken(req,res,next);
      }
    };


    var verifyUser = function(){
        return function(req,res,next){
            var userName = req.body.username;
            var passWord = req.body.password;

            if(!userName || !passWord) {
                res.status(400).send(req.body);
                return;
            }

            db.users.findUserByUsername(userName)
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

    var signToken = function(user){

        return jwt.sign(
            {
                user: user,
                time: new Date()
            },
            config.secrets.jwt,
            {
                expiresInMinutes: config.expireTime
            }
        )
    }

    var signIn = function (){

        return function(req,res,next){

            //var userName = req.body.userName;
            //var token    = req.body.token;

            var newToken = signToken(req.user);

            console.log("New Token: "+newToken);

            res.json({
                token: newToken
            })
        }
    }

    return {
        verifyUser: verifyUser,
        signIn : signIn,
        checkToken: checkToken
    }
}
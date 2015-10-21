/**
 * Created by hoanglvq on 10/17/15.
 */
var jwt         = require('jsonwebtoken');
var config      = require('../config/config');
var expressJwt  = require('express-jwt')({ secret: config.secrets.jwt });
var fs          = require('fs');


module.exports  = function(app){
    var db = app.get('models');

    var checkToken = function(){

      return function(req,res,next){

          expressJwt(req,res,next);

      }
    };

    var checkRole = function(){
        return function(req,res,next){

            var currentRoute        = req.route.path;
            var currentRole         = req.user.user.userrole;
            var currentAccessRoles  = [];
            config.pathAccessRole.forEach(function(item){
                console.log(item);
                if(item.url == currentRoute){
                    currentAccessRoles = item.role;
                    return;
                }
            });

            console.log(currentAccessRoles);

            if(currentAccessRoles.indexOf(currentRole) != -1){
                console.log("ok");
                next();
            }else{
                console.log("err");
                res.status(401).send('Your permission is denied');
            }


        }
    }

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
        checkToken: checkToken,
        checkRole: checkRole
    }
}
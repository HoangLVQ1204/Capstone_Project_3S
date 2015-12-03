/**
 * Created by hoanglvq on 10/17/15.
 */
var jwt         = require('jsonwebtoken');
var config      = require('../config/config');
var expressJwt  = require('express-jwt')({ secret: config.secrets.jwt });
var fs          = require('fs');


module.exports  = function(app){

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to get entity
     *
     * */
    var db = app.get('models');

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to check token if valid
     *
     * */
    var checkToken = function(){
        return function(req,res,next){
            console.log("---DATA REQ---");
            console.log(req.headers);
            console.log("---DATA REQ---");
            expressJwt(req,res,next);
        }
    };

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to check role of current login user
     * (1) : shipper
     * (2) : store
     * (3) : admin
     *
     * */
    var checkRole = function () {
        return function (req, res, next) {
            var tokenTime = req.user.time;
            var username = req.user.username;

            db.user.findUserByUsername(username).then(function(user){
                if(user.isBanned()){
                    res.status(401).send('Banned');
                }else{
                    db.user.checkTokenTime(username, tokenTime).then(function (tk) {
                        if (tk) {
                            var currentRoute = req.route.path;
                            var currentRole = req.user.userrole;
                            var currentAccessRoles = [];
                            config.pathAccessRole.forEach(function (item) {
                                if (item.url == currentRoute) {
                                    currentAccessRoles = item.role;
                                    return;
                                }
                            });
                            if (currentAccessRoles.indexOf(currentRole) != -1) {
                                next();
                            } else {
                                res.status(401).send('Your permission is denied')
                            }
                        } else {
                            res.status(401).send('Your account was log in at another place!')
                        }
                    }, function () {
                        res.status(401).send('Your account was log in at another place!')
                    })
                }
            })
        }
    }



    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to verify user if user is exist
     *
     * */
    var verifyUser = function(){
        return function(req,res,next){
            var userName = req.body.username;
            var passWord = req.body.password;

            if(!userName || !passWord) {
                res.status(400).send(req.body);
                return;
            }

            db.user.findUserByUsername(userName)
                .then(function(user){
                    if(!user){
                        res.status(401).send('No user with the given username');
                    }else{

                        if(!user.authenticate(passWord)){
                            res.status(401).send('Wrong password');
                        }else if(user.isBanned()){
                            console.log(user.isBanned());
                            res.status(401).send('Banned');
                        }else{
                            var loginTime = new Date()
                            db.user.updateLoginTime(user.username, loginTime)
                            if(user.userrole == 2 ){
                                db.managestore.getStoresOfUser(user.username,db.store)
                                    .then(function(listStore){
                                        var stores = listStore.map(function(data){
                                            return data.toJSON().store;
                                        });
                                        user.stores = stores;
                                        req.user = user;
                                        next();
                                    },function(err){
                                        next(err);
                                    });
                            }else{
                                req.user = user;
                                next();
                            }
                        }
                    }
                },function(err){
                    next(err);
                });
        }
    }

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to generate a new token for client
     *
     * */
    var signToken = function(user){

        return jwt.sign(
            {
                username       : user.username,
                userrole       : user.userrole,
                userstatus     : user.userstatus,
                stores         : user.stores,
                time           : new Date()
            },
            config.secrets.jwt,
            {
                expiresIn: config.expireTime
            }
        )
    }

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to sign in
     *
     * */
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
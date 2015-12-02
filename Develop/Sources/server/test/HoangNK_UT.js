/**
 * Created by HoangNK
 */

var expect  = require("chai").expect;
var request = require("request");
var server = require('../server');
var orderManage = require("../manages/orderManage")(server.app);
var storeManage = require("../manages/storeManage")(server.app);
var shipperManage = require("../manages/shipperManage")(server.app);
var userManage = require("../manages/userManage")(server.app);

/*
 * By HoangNK - 30/11/2015
 *
 * These UT functions is used to test ORDER-MANAGE FUNCTIONS
 *
 * */
describe("ADMINFUNCTIONS TEST:", function () {

    /*
     * By HoangNK - 11/29/15
     * Test GET ALL ORDERS of store
     */
    describe("FUNCTION ADD NEW SHIPPER", function () {
        //TEST CASE AD_Function1
        //var user1 = null;
        //it("Test case AD_Function1_01", function (done) {
        //    userManage.addNewUser(user1).then(function(rs){
        //        expect(rs).to.be.null;
        //        done();
        //    },function(er){
        //
        //    });
        //
        //});

        var user2 = {
            account: {
                'username' : 'SP111114',
                'userrole': 1,
                'userstatus': 2
            },
            profile: {
                'username' : 'SP111114',
                'name': 'Nguyen Van A',
                'identitycard': '123456789',
                'address': 'So 36, Xuan Thuy, Cau Giay, Ha Noi',
                'dob': '01/01/1993',
                'email': 'nguyenvana@gmail.com',
                'phonenumber': '0986468965',
                'avatar': './default.png',
            }
        }
        it("Test case AD_Function1_02", function (done) {
            userManage.addNewUser(user2).then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
            });
        });

        it("Test case AD_Function1_03", function (done) {
           userManage.addNewUser(user2).then(function (rs){
            },function(er){
                //console.log(er);
                expect(er).to.be.not.null;
               done();
            });
        });

    });

    describe("FUNCTION ADD NEW STORE:", function () {
        //TEST CASE AD_Function1
        //var user1 = null;
        //it("Test case AD_Function1_01", function (done) {
        //    userManage.addNewUser(user1).then(function(rs){
        //        expect(rs).to.be.null;
        //        done();
        //    },function(er){
        //
        //    });
        //
        //});

        var store2 = {
                'storeid' : 'STR112',
                'name': '3S Food',
                'description': 'Food',
                'address': 'So 36, Xuan Thuy, Cau Giay, Ha Noi',
                'email': 'nguyenvana@gmail.com',
                'phonenumber': '0986468965',
                'avatar': './default.png',
                'registereddate': new Date()

        }
        it("Test case AD_Function2_02", function (done) {
            storeManage.postNewStore(store2).then(function (rs){
                //console.log(rs);
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
            });
        });

        it("Test case AD_Function2_03", function (done) {
            storeManage.postNewStore(store2).then(function (rs){
            },function(er){
                //console.log(er);
                expect(er).to.be.not.null;
                done();
            });
        });

    });
});

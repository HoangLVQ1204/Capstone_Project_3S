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
var issueManage = require("../manages/issueManage")(server.app);

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

    describe("FUNCTION UPDATE TASK FOR SHIPPER:", function () {
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

        var shipperList2 = [{
            tasks: []
        }]
        it("Test case AD_Function3_02", function (done) {
            shipperManage.updateTaskForShipper(shipperList2).then(function (rs){
                //console.log(rs);
                expect(rs).to.be.empty;
                done();
            },function(er){
            });
        });

        var shipperList3 = [{
            tasks: [
                {
                    orderid: "OD669907",
                    shipperid: "SP000002",
                    adminid: "AD000001",
                    statusid: 1,
                    typeid: 1,
                    taskdate: "2015-12-02"
                }
            ]
        }]
        it("Test case AD_Function3_03", function (done) {
            shipperManage.updateTaskForShipper(shipperList3).then(function (rs){
                //console.log(rs);
                expect(rs).to.be.not.empty;
                done();
            },function(er){
                //console.log(er);
                //done();
            });
        });

    });

    describe("FUNCTION GET LATEST LEDGER OF STORE:", function () {

        it("Test case AD_Function4_01", function (done) {
            storeManage.getLatestLedgerOfStore(null).then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function4_02", function (done) {
            storeManage.getLatestLedgerOfStore("STR999").then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function4_03", function (done) {
            storeManage.getLatestLedgerOfStore("STR001").then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
    });

    describe("FUNCTION UPDATE LEDGER FOR ORDER OF STORE:", function () {

        it("Test case AD_Function5_01", function (done) {
            storeManage.updateLedgerForOrder(null).then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function5_02", function (done) {
            storeManage.updateLedgerForOrder("STR999").then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function5_03", function (done) {
            storeManage.updateLedgerForOrder("STR001").then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
    });

    describe("FUNCTION POST NEW LEDGER:", function () {

        //it("Test case AD_Function6_01", function (done) {
        //    storeManage.postNewLedger(null).then(function (rs){
        //
        //    },function(er){
        //        //console.log(er);
        //        expect(er).to.deep.equal(new Error("Null Exception"));
        //        done();
        //    });
        //});

        var ledger2 = {
            'storeid': 'STR999',
            'adminid': 'AD000001',
            'amount': 10000,
            'balance': 10000,
            'paydate': new Date(),
            'payfrom': 1,
            'totaldelivery': 10000,
            'totalcod': 0,
            'note': 'Pay'
        }
        it("Test case AD_Function6_02", function (done) {
            storeManage.updateLedgerForOrder(ledger2).then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        var ledger3 = {
            'storeid': 'STR001',
            'adminid': 'AD000001',
            'amount': 10000,
            'balance': 10000,
            'paydate': new Date(),
            'payfrom': 1,
            'totaldelivery': 10000,
            'totalcod': 0,
            'note': 'Pay'
        }
        it("Test case AD_Function6_03", function (done) {
            storeManage.updateLedgerForOrder(ledger3).then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
    });

    describe("FUNCTION GET DETAIL OF ISSUE:", function () {

        //it("Test case AD_Function7_01", function (done) {
        //    issueManage.getIssueDetail(null).then(function (rs){
        //
        //    },function(er){
        //        //console.log(er);
        //        expect(er).to.deep.equal(new Error('empty'));
        //        done();
        //    });
        //});

        it("Test case AD_Function7_02", function (done) {
            issueManage.getIssueDetail(999).then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function7_03", function (done) {
            issueManage.getIssueDetail(1).then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
    });


    describe("FUNCTION GET DETAIL OF STORE:", function () {

        //it("Test case AD_Function8_01", function (done) {
        //    storeManage.getStoreDetail(null).then(function (rs){
        //
        //    },function(er){
        //        //console.log(er);
        //        expect(er).to.deep.equal(new Error('empty'));
        //        done();
        //    });
        //});

        it("Test case AD_Function8_02", function (done) {
            storeManage.getStoreDetail("STR999").then(function (rs){

            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function8_03", function (done) {
            storeManage.getStoreDetail("STR001").then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                //expect(er).to.deep.equal(new Error('empty'));
                //done();
            });
        });
    });

    describe("FUNCTION UPDATE RESOLVED OF STORE:", function () {

        //it("Test case AD_Function9_01", function (done) {
        //    storeManage.getStoreDetail(null).then(function (rs){
        //
        //    },function(er){
        //        //console.log(er);
        //        expect(er).to.deep.equal(new Error('empty'));
        //        done();
        //    });
        //});

        it("Test case AD_Function9_02", function (done) {
            issueManage.updateResolveIssue(1,1).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_03", function (done) {
            issueManage.updateResolveIssue(1,4).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_04", function (done) {
            issueManage.updateResolveIssue(1,2).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_05", function (done) {
            issueManage.updateResolveIssue(1,5).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_06", function (done) {
            issueManage.updateResolveIssue(1,0).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_07", function (done) {
            issueManage.updateResolveIssue(999,1).then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });


        it("Test case AD_Function9_08", function (done) {
            issueManage.updateResolveIssue(999,4).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_09", function (done) {
            issueManage.updateResolveIssue(999,2).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_10", function (done) {
            issueManage.updateResolveIssue(999,5).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_11", function (done) {
            issueManage.updateResolveIssue(999,0).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case AD_Function9_12", function (done) {
            issueManage.updateResolveIssue(1,null).then(function (rs){
                expect(rs).not.to.be.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
    });

});

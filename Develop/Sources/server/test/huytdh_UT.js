/**
 * Created by Kaka Hoang Huy on 12/1/2015.
 */
var chai  = require("chai");
var expect  = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var request = require("request");
var server = require('../server');
var shipperManage = require("../manages/shipperManage")(server.app);

/*
 * By HuyTDH - 30/11/2015
 *
 * These UT functions is used to test ORDER-MANAGE FUNCTIONS
 *
 * */
describe("SHIPPER-MANAGE FUNCTIONS TEST:", function () {

    /*
     * By HuyTDH - 11/29/15
     * Test GET ALL ORDERS of store
     */
    describe("FUNCTION GET ALL TASK HISTORY:", function () {
        //TEST CASE SP01_01
        it("Test case SP21_01", function (done) {
            shipperManage.getHistory(null, -1).then(function(rs){
                expect(rs).to.deep.equal({ current: [], total: { total: '0' } });
                done();
            })
        });

        it.only("Test case SP21_02", function (done) {
            shipperManage.getHistory("SP000001", -1).then(function(rs){
                console.log(rs);
                // expect(rs).to.have.deep.property("current");
                // expect(rs).to.have.deep.property("total");
                done();
            })
        });

        it("Test case SP21_03", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_04", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_05", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_06", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_07", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_08", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_09", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_10", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_11", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_12", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_13", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_14", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP21_15", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP01_16", function (done) {
            shipperManage.getHistory(null, null).then(function(rs){
                console.log(rs)
            },function(er){
                expect(er).to.equal("Can't not get datas");
            }).then(function(){
                done();
            });
        });

    });

    describe("FUNCTION GET DETAIL OF TASK:", function () {
        
        it("Test case SP22_01", function (done) {
            shipperManage.getDetail("SP000001", 1).then(function(rs){
                console.log(rs)
                //expect(rs).to.deep.equal({ current: [], total: { total: '0' } });
                done();
            })
        });

    });
});
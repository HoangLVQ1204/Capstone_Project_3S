/**
 * On 02/12
 * @author: quyennv
 *
 */

// var assert = require('chai').assert
var expect  = require("chai").expect;
var should  = require("chai").should();
var request = require("request");
var server = require('../server');

var orderManage = require("../manages/orderManage")(server.app);
var shipperManage = require("../manages/shipperManage")(server.app)



// describe("==========FUNCTION==========\n", function() {
//     describe("=====GET TASKS=====\n", function() {
//         it("should throw error\n", function(done) {
//             var d = domain.create();
//                 d.on('error', function(err) {
//                 d.exit();
//                 process.nextTick(function () {
//                     console.log('TTTTT++++:', err); // Just to show something on the console.
//                     expect(err instanceof Error).to.be.true;
//                     done();
//                 });
//             });

//             d.run(function () {
//                 shipperManage.getTasks(null, function() {
//                    throw new Error('This is my error');
//                 })
//             });
//         })
//     })
// });

describe("==========UNIT TEST PRO==========\n", function() {

    it("1. =====Get Tasks=====\n", function (done) {
        shipperManage.getTasks(null).then(function(rs){
            console.log('RR++', rs);
            expect(rs).not.to.be.null;
        },function(err){
            console.log('TT+++', err)
            var testErr = new Error('Result = empty');
            expect(err).to.deep.equal(testErr);
        }).then(function(){
            done();
        });
    });

    it("2. =====Get Task Be Issue Pending======\n", function(done) {
        shipperManage.getTaskBeIssuePending("SP000001").then(function(rs) {
            console.log("Result:", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });

    it("3. =====CHANGE IS PENDING ORDER======\n", function(done) {
        shipperManage.changeIsPending(null, null).then(function(rs) {
            console.log("Result:", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });

});
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
var domain = require("domain");

var orderManage = require("../manages/orderManage")(server.app);
var shipperManage = require("../manages/shipperManage")(server.app)



describe("==========FUNCTION==========\n", function() {
    describe("=====GET TASKS=====\n", function() {
        it("should throw error\n", function(done) {
            var d = domain.create();
                d.on('error', function(err) {
                d.exit();
                process.nextTick(function () {
                    console.log('TTTTT++++:', err); // Just to show something on the console.
                    expect(err instanceof Error).to.be.true;
                    done();
                });
            });

            d.run(function () {
                shipperManage.getTasks(null, function() {
                   throw new Error('This is my error');
                })
            });
        })
    })
});

describe("==========FUNCTION 6==========", function() {

    describe("CASE1: Get Tasks", function() {
        it("should throw true", function (done) {
            shipperManage.getTasks('AD000001').then(function(rs){
                expect(rs).not.to.be.null;
            },function(er){
                expect(er).to.be.null;
            });
        });
    });

});
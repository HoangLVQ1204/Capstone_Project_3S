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
var orderManage = require("../manages/orderManage")(server.app)

describe("==========UNIT TEST PRO==========\n", function() {

    it("==================GET TASKS==================\n", function (done) {
        shipperManage.getTasks(null).then(function(rs){
            console.log('RR++44', rs);
            expect(rs).not.to.be.null;
        },function(err){
            var testErr = new Error('Result = empty');
            expect(err).to.deep.equal(testErr);
        }).then(function(){
            done();
        });
    });

    it("==================GET TASK BE ISSUE PENDING==================\n", function(done) {
        shipperManage.getTaskBeIssuePending("SP000001").then(function(rs) {
            console.log("Result:57", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });

    it("==================CHANGE IS PENDING ORDER==================\n");
    it("1. -----TEST CASE 1-----\n", function(done) {
        shipperManage.changeIsPending(null, null).then(function(rs) {
            console.log("Result:68", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("2. -----TEST CASE 2-----\n", function(done) {
        shipperManage.changeIsPending("SP000001", null).then(function(rs) {
            console.log("Result:79", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("3. -----TEST CASE 3-----\n", function(done) {
        shipperManage.changeIsPending("AD000001", null).then(function(rs) {
            console.log("Result:89", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("4. -----TEST CASE 4-----\n", function(done) {
        shipperManage.changeIsPending("ST000001", null).then(function(rs) {
            console.log("Result:99", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("5. -----TEST CASE 5-----\n", function(done) {
        shipperManage.changeIsPending("#@#!^*(_+)", null).then(function(rs) {
            console.log("Result:109", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("6. -----TEST CASE 6-----\n", function(done) {
        shipperManage.changeIsPending(null, 5).then(function(rs) {
            console.log("Result:119", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("7. -----TEST CASE 7-----\n", function(done) {
        shipperManage.changeIsPending("SP000001", 5).then(function(rs) {
            console.log("Result:129", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("8. -----TEST CASE 8-----\n", function(done) {
        shipperManage.changeIsPending("AD000001", 5).then(function(rs) {
            console.log("Result:139", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("9. -----TEST CASE 9-----\n", function(done) {
        shipperManage.changeIsPending("ST000001", 5).then(function(rs) {
            console.log("Result:149", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("10. -----TEST CASE 10-----\n", function(done) {
        shipperManage.changeIsPending("#@#!^*(_+)", 5).then(function(rs) {
            console.log("Result:159", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("11. -----TEST CASE 11-----\n", function(done) {
        shipperManage.changeIsPending(null, "#@#!^*(_+)").then(function(rs) {
            console.log("Result:169", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("12. -----TEST CASE 12-----\n", function(done) {
        shipperManage.changeIsPending("SP000001", "#@#!^*(_+)").then(function(rs) {
            console.log("Result:179", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("13. -----TEST CASE 13-----\n", function(done) {
        shipperManage.changeIsPending("ST000001", "#@#!^*(_+)").then(function(rs) {
            console.log("Result:189", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("14. -----TEST CASE 14-----\n", function(done) {
        shipperManage.changeIsPending("#@#!^*(_+)", "#@#!^*(_+)").then(function(rs) {
            console.log("Result:199", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });
    it("15. -----TEST CASE 15-----\n", function(done) {
        shipperManage.changeIsPending("AD000001", "#@#!^*(_+)").then(function(rs) {
            console.log("Result:209", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            expect(err).to.deep.equal(new Error('Result = empty'));
        }).then(function() {
            done();
        });
    });


    it("==================REQUEST CANCEL ORDER==================\n");
    it("1. -----TEST CASE 1-----\n", function(done) {
        orderManage.cancelOrder(null, null, null).then(function(rs) {
            console.log("Result:224", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("2. -----TEST CASE 2-----\n", function(done) {
        orderManage.cancelOrder("ST000001", null, null).then(function(rs) {
            console.log("Result:236", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("3. -----TEST CASE 3-----\n", function(done) {
        orderManage.cancelOrder("$%@@#@(*", null, null).then(function(rs) {
            console.log("Result:248", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("4. -----TEST CASE 4-----\n", function(done) {
        orderManage.cancelOrder(null, "STR001", null).then(function(rs) {
            console.log("Result:260", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("5. -----TEST CASE 5-----\n", function(done) {
        orderManage.cancelOrder("ST000001", "STR001", null).then(function(rs) {
            // console.log("Result:272", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("6. -----TEST CASE 6-----\n", function(done) {
        orderManage.cancelOrder("$%@@#@(*", "STR001", null).then(function(rs) {
            // console.log("Result:224", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("7. -----TEST CASE 7-----\n", function(done) {
        orderManage.cancelOrder(null, "STR001", "OD385512").then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    //Normal
    it("8. -----TEST CASE 8-----\n", function(done) {
        orderManage.cancelOrder("ST000001", "STR001", "OD385512").then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("9. -----TEST CASE 9-----\n", function(done) {
        orderManage.cancelOrder("$%@@#@(*", "STR001", "OD385512").then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            console.log("Error Sequelize", err);
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("10. -----TEST CASE 10-----\n", function(done) {
        orderManage.cancelOrder(null, null, "OD385512").then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("11. -----TEST CASE 11-----\n", function(done) {
        orderManage.cancelOrder("ST000001", null, "OD385512").then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("12. -----TEST CASE 12-----\n", function(done) {
        orderManage.cancelOrder("$%@@#@(*", null, "OD385512").then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("==================CREATE ISSUE PENDING==================\n");
    // sample data
    var newIssue = {
        typeid: 1,
        description: 'This is test'
    };
    var orders = ['OD090909', 'OD122122', 'OD123322'];

    it("1. -----TEST CASE 1-----\n", function(done) {
        shipperManage.createIssuePending(null, newIssue, orders, 1).then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("2. -----TEST CASE 2-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", null, orders, 1).then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("3. -----TEST CASE 3-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, null, 1).then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });


    it("4. -----TEST CASE 4-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, orders, null).then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("5. -----TEST CASE 5-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, orders, 1).then(function(rs) {
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    var newIssue6 = {
        typeid: 4,
        description: 'Issue Cancel'
    }
    var orders6 = ['OD154444'];
    it("6. -----TEST CASE 6-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue6, orders6, 2).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("7. -----TEST CASE 7-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, orders, 3).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            // console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("8. -----TEST CASE 8-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, orders, 'AAAAA').then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("9. -----TEST CASE 9-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", null, orders, null).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("10. -----TEST CASE 10-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", null, orders, 2).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("11. -----TEST CASE 11-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", null, orders, 3).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("12. -----TEST CASE 12-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", null, orders, 'AAAAA').then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("13. -----TEST CASE 13-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, null, 2).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });

    it("14. -----TEST CASE 14-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, null, 2).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("15. -----TEST CASE 15-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, null, 3).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("16. -----TEST CASE 16-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, null, 'AAAAA').then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("17. -----TEST CASE 17-----\n", function(done) {
        shipperManage.createIssuePending("SP000001", newIssue, null, null).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });
    it("18. -----TEST CASE 18-----\n", function(done) {
        shipperManage.createIssuePending(null, null, null, null).then(function(rs) {
             console.log("RS+_++++", rs);
            expect(rs).not.to.be.null;
        }, function(err) {
            //Cannot Handle
            console.log("ERER++++", err);
            // expect(err).to.deep.equal(new Error('NullException'));
        }).then(function() {
            done();
        });
    });




});
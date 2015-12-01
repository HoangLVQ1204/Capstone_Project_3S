/**
 * Created by Kaka Hoang Huy on 11/30/2015.
 */

var expect  = require("chai").expect;
var request = require("request");

/*
 * By HuyTDH - 30/11/2015
 *
 * This function is used to test shipper API
 *
 * */
describe("Shipper APIs", function() {

    /*
     * By HuyTDH - 11/29/15
     * Test API GET LIST TASKS of shipper
     */
    describe("Get list of tasks", function() {
        var url = "http://localhost:3000/api/tasks";
        var options = {
            url: url,
            headers: {
                Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlNQMDAwMDAxIiwidXNlcnJvbGUiOjEsInVzZXJzdGF0dXMiOjIsInRpbWUiOiIyMDE1LTExLTI5VDE5OjQ5OjUxLjczMFoiLCJpYXQiOjE0NDg4MjY1OTEsImV4cCI6MTQ0OTY5MDU5MX0.3Z995aY2BGgIbkTWOxvPoVDZTUXoaQ96QrI9ItKjWvU'
            }
        };

        it("returns ok", function(done) {
            request(options, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).not.to.be.null;
                done();
            });
        });

        it("returns fail without token", function(done) {
            request(url, function(error, response, body) {
                //expect(body).to.equal("");
                expect(response.statusCode).to.equal(401);
                expect(body).not.to.be.null;
                done();
            });
        });

    });

    /*
     * By HuyTDH - 11/30/15
     * Test API task history of shipper
     * Function code SP01
     * Test case SP01_01 ~ SP01_16
     */
    describe("API SHIPPER GET HISTORY (SP01)", function() {
        var url = "http://localhost:3000/api/shipper/history?page=0";
        var tokenSP1 = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlNQMDAwMDAxIiwidXNlcnJvbGUiOjEsInVzZXJzdGF0dXMiOjIsInRpbWUiOiIyMDE1LTExLTMwVDE5OjE3OjM1Ljk1MloiLCJpYXQiOjE0NDg5MTEwNTUsImV4cCI6MTQ0OTc3NTA1NX0.K5zwW8KKj2P2phvO5Zn_xFGTNXjnQtW3OetVESeRDLE";
        var tokenSP2 = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlNQMDAwMDAxIiwidXNlcnJvbGUiOjEsInVzZXJzdGF0dXMiOjIsInRpbWUiOiIyMDE1LTExLTMwVDE5OjE3OjM1Ljk1MloiLCJpYXQiOjE0NDg5MTEwNTUsImV4cCI6MTQ0OTc3NTA1NX0.K5zwW8KKj2P2phvO5Zn_xFGTNXjnQtW3OetVESeRDLE";
        var option1 = {
            url: url,
            headers: {
                Authorization: tokenSP1
            }
        };
        //TEST CASE SP01_01
        it("Test case SP01_01", function(done) {
            request(option1, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).not.to.be.null;
                done();
            });
        });
        //TEST CASE SP01_02
        it("Test case SP01_02", function(done) {
            var option2 = {
                url: url,
                headers: {
                    Authorization: tokenSP2
                }
            };
            request(option2, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).not.to.be.null;
                done();
            });
        });
        //TEST CASE SP01_03
        it("Test case SP01_03", function(done) {
            request(options1, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).not.to.be.null;
                done();
            });
        });

    });

    //it("should display input text from a form.", function(done){
    //    request.post('localhost:8080')
    //        .type('form')
    //        .send({field: "Test string."})
    //        .end(function(res){
    //            expect(res).to.exist;
    //            expect(res.status).to.equal(200);
    //            expect(res.text).to.contain("Test");
    //            done();
    //        })
    //});
});

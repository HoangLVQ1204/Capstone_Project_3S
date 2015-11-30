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

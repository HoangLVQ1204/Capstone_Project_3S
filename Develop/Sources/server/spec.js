

var app = require('./server');
var request = require('supertest');
var expect = require('chai').expect;
var logger = require('./util/logger');

var db = app.get('models');


describe('[Category]', function() {

	var category = 'test category';
	var categoryArrays = ['test category 1', 'test category 2'];	

	before(function(done) {
		db.Category.destroy({
			where: {}
		})
		.then(function(deleted) {
			logger.log('Category Deleted: ' + deleted);
			done();
		})
	});

	it('should create array of categories >> POST /api/categories <<', function(done) {
		request(app)
			.post('/api/categories')
			.send(categoryArrays)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201)
			.end(function(err, resp) {				
				expect(resp.body).to.be.an('array');
				expect(resp.body.length).to.equal(categoryArrays.length);
				done();
			})
	});

	it('should get all categories >> GET /api/categories/count <<', function(done) {
		request(app)
			.get('/api/categories/count')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, resp) {				
				expect(resp.body).to.be.an('array');
				expect(resp.body.length).to.equal(categoryArrays.length);
				done();
			});
	});

	it('should get a category >> GET /api/categories/:category_id <<', function(done) {
		request(app)
			.post('/api/categories')
			.send([category])
			.set('Accept', 'application/json')
			.end(function(err, resp) {				
				var returnedCategoryId = resp.body[0];				
				console.log('end', returnedCategoryId);
				request(app)
					.get('/api/categories/' + returnedCategoryId)
					.end(function(err, resp) {
						expect(resp.body).to.equal(category);
						done();
					});
			});
	});			

	it('should update a category >> PUT /api/categories/:category_id <<', function(done) {
		var newCategory = {
			CategoryName: 'new test category'
		};

		request(app)
			.post('/api/categories')
			.send([category])
			.set('Accept', 'application/json')
			.end(function(err, resp) {
				var returnedCategoryId = resp.body[0];
				request(app)
					.put('/api/categories/' + returnedCategoryId)
					.send(newCategory)
					.end(function(err, resp) {
						expect(resp.body).to.have.property('CategoryId', returnedCategoryId);						
						expect(resp.body).to.have.property('CategoryName', newCategory.CategoryName);
						done();
					});
			});
	});

	it('should delete a category >> DELETE /api/categories/:category_id <<', function(done) {
		request(app)
			.post('/api/categories')
			.send([category])
			.set('Accept', 'application/json')
			.end(function(err, resp) {
				var returnedCategoryId = resp.body[0];
				request(app)
					.delete('/api/categories/' + returnedCategoryId)
					.end(function(err, resp) {
						expect(resp.body).to.have.property('CategoryId', returnedCategoryId);						
						expect(resp.body).to.have.property('CategoryName', category);
						done();
					});
			});
	});	
});
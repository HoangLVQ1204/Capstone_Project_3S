var _ = require('lodash');
var logger = require('./logger');

logger.log('Seeding the Database');

var users = [
	{
		username: "hoang",
		password: "$2a$10$rrMc9Bwlu0IySsKxPOnsq.uOHH1.2Gxc4ZMklJUOHAdQzFLmM9QOO",
		userrole: "1",
		userstatus: "3",
		token: "token1"
	},
	{
		username: "huy",
		password: "pass2",
		userrole: "2",
		userstatus: "1",
		token: "token2"
	},
	{
		username: "quyen",
		password: "pass3",
		userrole: "3",
		userstatus: "2",
		token: "token3"
	}
];

var posts = [
	{
		Title: "post 1",
		Content: "content 1",
		UserId: 1,
		Status: "public",
		CommentStatus: "open"				
	},
	{
		Title: "post 2",
		Content: "content 2",
		UserId: 2,
		Status: "public",
		CommentStatus: "closed"
	},
	{
		Title: "post 3",
		Content: "content 3",
		UserId: 1,
		Status: "private",
		CommentStatus: "registered"
	},
	{
		Title: "post 4",
		Content: "content 4",
		UserId: 2,
		Status: "publish",
		CommentStatus: "open"
	},
	{
		Title: "post 5",
		Content: "content 5",
		UserId: 1,
		Status: "draft",
		CommentStatus: "closed"
	}
];

var categories = [
	{
		CategoryName: "Courses"		
	},
	{
		CategoryName: "Activities"
	},
	{
		CategoryName: "Program"	
	}
];

var shipper = [
	{
		shipperid: "SP1",
		identitycard: "123456",
		address: "Ha Noi",
		dob: new Date("12/04/1992"),
		email: "sp1@gmail.com",
		phonenumber:"0924500699",
		statusid: "shipping"
	},
	{
		shipperid: "SP1",
		identitycard: "123456",
		address: "Ha Noi",
		dob: new Date("12/04/1992"),
		email: "sp1@gmail.com",
		phonenumber:"0924500699",
		statusid: "shipping"
	},
	{
		shipperid: "SP1",
		identitycard: "123456",
		address: "Ha Noi",
		dob: new Date("12/04/1992"),
		email: "sp1@gmail.com",
		phonenumber:"0924500699",
		statusid: "shipping"
	},
]


module.exports = function(app) {	
	var db = app.get('models');
	
	var createInstance = function(model, instance) {
		return new Promise(function(resolve, reject) {
			model.build(instance)
				.save()
				.then(resolve, reject);
		});
	};

	var cleanDB = function() {
		logger.log('... cleaning the DB');
		var cleanPromises = [db.users]
			.map(function(model) {				
				return model.destroy({
					where: {}
				});
			});
		return Promise.all(cleanPromises);
	};


	var createUsers = function(data) {			
		var promises = users.map(function(user) {
			return createInstance(db.users, user);
		});

		return Promise.all(promises)
			.then(function(users) {				
				return _.merge({users: users}, data || {});
			});
	};

	//var createCategories = function(data) {
	//	var promises = categories.map(function(category) {
	//		return createInstance(db.Category, category);
	//	});
    //
	//	return Promise.all(promises)
	//		.then(function(categories) {
	//			return _.merge({categories: categories}, data || {});
	//		});
	//};
    //
	//var createPosts = function(data) {
	//	var promises = posts.map(function(post) {
	//		post.UserId = data.users[0].UserId;
	//		return createInstance(db.Post, post);
	//	});
    //
	//	return Promise.all(promises)
	//		.then(function(posts) {
	//			return _.merge({posts: posts}, data || {});
	//		});
	//};
    //
	//var createPostCategory = function(data) {
	//	var promises = [];
	//	for (i = 0; i < posts.length; ++i) {
	//		for (k = 0; k < categories.length; ++k) {
	//			promises.push({
	//				PostId: data.posts[i].PostId,
	//				CategoryId: data.categories[k].CategoryId
	//			});
	//		}
	//	}
	//	promises = promises.map(function(p) {
	//		return createInstance(db.PostCategory, p);
	//	})
    //
	//	return Promise.all(promises)
	//		.then(function(saved) {
	//			var result = 'Seeded DB with ' +
	//				data.users.length + ' Users, ' +
	//				data.categories.length + ' Categories, ' +
	//				data.posts.length + ' Posts';
    //
	//			return result;
	//		});
	//}

	return cleanDB()
		.then(createUsers)
		//.then(createCategories)
		//.then(createPosts)
		//.then(createPostCategory)
		.then(logger.log.bind(logger))
		.catch(logger.log.bind(logger));
}
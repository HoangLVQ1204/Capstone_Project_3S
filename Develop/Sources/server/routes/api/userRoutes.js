
module.exports = function(app){

 	var controller = require('./../../manages/userManage')(app);
	var authManage = require('./../../manages/authManage')(app);
	var config      = require('../../config/config');
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	app.param('username', controller.params);
 	app.param('user', controller.paramUsername);

	app.post('/api/user/addNewUser', checkAll,function(req,res,next){
		var user = req.body;
		controller.addNewUser(user).then(function(data){
			res.status(201).json(data);
		})
			.catch(function(err){
				next(err);
			})
	});

	app.get('/user/profile/:username',checkAll,controller.getProfileUser);

	app.route('/api/user/:user')
		.get(checkAll,function(req,res,next){
			res.status(200).json(req.userRequest.toJSON());
		})
		.put(controller.putUser);

	app.route('/api/userProfile/:user')
		.put(controller.putProfile);	

}
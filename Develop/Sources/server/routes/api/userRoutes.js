
module.exports = function(app){

 	var controller = require('./../../manages/userManage')(app);
	var authManage = require('./../../manages/authManage')(app);
	var config      = require('../../config/config');
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	app.param('username', controller.params);

	app.post('/api/user/addNewUser', controller.addNewUser);

	app.get('/user/profile/:username',checkAll,controller.getProfileUser);

	app.route('/api/user/:user')
		.get(controller.getUserDetail)
		.put(controller.putUser);

	app.route('/api/userProfile/:user')
		.put(controller.putProfile);

	app.param('user', controller.paramUsername);

}
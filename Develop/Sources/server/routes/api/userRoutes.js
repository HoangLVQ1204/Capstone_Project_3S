
module.exports = function(app){

 	var controller = require('./../../manages/userManage')(app);
	var authManage = require('./../../manages/authManage')(app);
	var config      = require('../../config/config');
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	app.param('username', controller.params);
 	 	
	//app.get('/users',checkAll,controller.get);

	app.get('/user/profile/:username',controller.getProfileUser);

    //app.route('/api/users/:user_id')
    //	.get(controller.getOne)
    //	.put(controller.put)
    //	.delete(controller.del);
}
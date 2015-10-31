
module.exports = function(app){

 	var controller = require('./../../manages/userController')(app);
	var authManage = require('./../../manages/authManage')(app);
	var config      = require('../../config/config');
	var checkAll = [authManage.checkToken(),authManage.checkRole()];

 	app.param('user_id', controller.params);
 	 	
	app.get('/users',checkAll,controller.get);

    app.route('/api/users/:user_id')
    	.get(controller.getOne)
    	.put(controller.put)
    	.delete(controller.del);
}
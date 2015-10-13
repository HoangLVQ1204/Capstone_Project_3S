
module.exports = function(app){
 	var controller = require('./userController')(app);

 	app.param('user_id', controller.params);
 	
    app.route('/users')
    	.get(controller.get)
    	.post(controller.post);

    app.route('/api/users/:user_id')
    	.get(controller.getOne)
    	.put(controller.put)
    	.delete(controller.del);
}
var server = require('./server/server');
var config = require('./server/config/config');
var logger = require('./server/util/logger');


// setup database, start server after syncing database
server.get('models').sequelize.sync().then(function() {
	server.listen(config.port, function() {
		logger.log('Listening on http://localhost:' + config.port);
	});
});
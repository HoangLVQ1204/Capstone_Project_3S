var _ = require('lodash');

var config = {
	dev: 'development',
	prod: 'production',
	test: 'testing',
	port: process.env.PORT || 3000
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

try {
	envConfig = require('./' + config.env);

	envConfig = envConfig || {};	
} catch (e) {
	envConfig = {};
}

// merge basic config and environment config
module.exports = _.merge(config, envConfig);
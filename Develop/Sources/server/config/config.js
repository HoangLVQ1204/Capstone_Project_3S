var _ = require('lodash');
var accessRole = require('./accessRole.json');

var config = {
	dev: 'development',
	prod: 'production',
	test: 'testing',
	port: process.env.PORT || 3000,
	expireTime: 24*60*10*60,
	secrets: {
		jwt: process.env.JWT || 'hoanglvqse90184'
	},
	pathAccessRole: accessRole
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
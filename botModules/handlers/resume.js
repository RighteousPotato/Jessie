//DEPENDENCIES
const {log} = require('../logger.js');

module.exports = {
	on: 'resume',
	execute() {
		log.info('Resumed');
	}
};
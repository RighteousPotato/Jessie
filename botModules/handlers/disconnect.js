//DEPENDENCIES
const {log} = require('../logger.js');

module.exports = {
	on: 'disconnect',
	execute(e) {
		log.error(`Jessie has disconnected!\nCode:${e.code}\nReason:${e.reason}`);
	}
};
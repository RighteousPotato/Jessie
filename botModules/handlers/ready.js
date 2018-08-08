//DEPENDENCIES
const {log} = require('../logger.js');

module.exports = {
	on: 'ready',
	execute() {
		log.info('Ready');
		this.user.setActivity('Pokémon Go!');
	}
};
const {ids} = require('../config.json');
module.exports = {
    name: 'loadhands',
    desc: 'Reload event handlers',
	users: [ids.owner],
    execute(message, args) {
		message.client.loadHandlers();
		message.channel.send('Event handlers reloaded');
	}
};
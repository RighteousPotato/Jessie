const {ids} = require('../config.json');
module.exports = {
    name: 'loadjobs',
    desc: 'Reload jobs',
	users: [ids.owner],
    execute(message, args) {
		message.client.loadJobs();
		message.channel.send('Jobs reloaded');
	}
};
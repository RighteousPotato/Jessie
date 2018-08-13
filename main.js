//DEPENDENCIES
const Discord = require('discord.js');
const discordExt = require('./botModules/discordExt.js');
const {log, usrLog} = require('./botModules/logger.js');
const clientCmds = require('./botModules/clientCmds.js');
const {token} = require('./data/auth.json');
const {ids} = require('./data/config.json');

//SETUP CLIENT
const client = new Discord.Client({fetchAllMembers: true});
for(const prop of Object.keys(clientCmds)){
	client[prop] = clientCmds[prop];
};

//START CLIENT
log.info('Starting up...');
client.loadHandlers();
client.login(token)
	.then(x=>{
		client.startedAt = new Date();
		client.loadCommands();
		client.loadJobs();
	})
	.catch(e=>{
		log.error('Could not log in.');
		log.error(e);
		process.exit(0);
	});
process.on('unhandledRejection', (error,promise) =>{
	log.warn(`Uncaught Promise Rejection:\n${error.stack}`);
});
process.on('warning', (error) =>{
	log.warn(`Node warning: ${error.name}\n${error.message}\n${'='.repeat(55)}\n${error.stack}`);
});
module.exports = client;
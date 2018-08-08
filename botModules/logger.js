//DEPENDENCIES
const Discord = require('discord.js');
const log = require('winston');
const {webhooks} = require('../data/auth.json');
const {ids} = require('../data/config.json');

class DiscordLogger extends log.Transport{
	constructor(options){
		super(options);
		this.name = 'discordLogger';
		this.level = options.level || 'info';
		this.client = new Discord.WebhookClient(options.wh.id, options.wh.token);
	};
	log(level, msg, meta, callback){
		const m = level.toLowerCase()=='error' ? `<@${ids.owner}>` : '';
		if(this.client){
			const emb = new Discord.RichEmbed()
				.setTitle((level||'LOG').toUpperCase())
				.setColor((log.config.allColors[level] || 'DEFAULT').toUpperCase())
				.setDescription(msg||'LOG')
				.setTimestamp();
			try{
				this.client.send(m, emb);
			}catch(e){
				console.log(`Couldn\'t log ${level} to Discord!`);
			};
		}else{
			console.log(`Couldn\'t log ${level} to Discord!`);
		};
		callback(null, true);
	};
};

log.transports.DiscordLogger = DiscordLogger;

//SETUP LOGGER
log.default.transports.console.colorize= true;
log.padLevels = true;
log.level = 'debug';
log.setLevels(log.config.npm.levels);
log.add(log.transports.File, {
	filename: 'logs/bot.log',
	level: 'debug'
});
log.add(log.transports.DiscordLogger, {
	level: 'info',
	wh: webhooks.log
});


//log.setLevels(Object.assign(log.config.npm.levels, {'lError': 0, 'lWarn': 1, 'lDebug': 4}));
//log.addColors({'lError': 'red', 'lWarn': 'yellow', 'lDebug': 'cyan'});
log.addColors({'leave': 'red', 'join': 'green', 'trust': 'green'});

const libLog = new log.Logger({
	transports: [
		new log.transports.File({
			filename: 'logs/library.log',
			level: 'debug'
		}),
		new log.transports.Console({
			colorize: true,
			level: 'warn'
		})
	],
	levels: {error:0, warn:1, debug:2}
});

const usrLog = new log.Logger({
	transports: [
		new log.transports.File({
			filename: 'logs/users.log',
			level: 'debug'
		}),
		new log.transports.DiscordLogger({
			level: 'info',
			wh: webhooks.usrLog
		})
	],
	levels: log.config.npm.levels
});

module.exports = {
	log: log,
	libLog: libLog,
	usrLog: usrLog
};
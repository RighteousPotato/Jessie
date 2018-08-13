//DEPENDENCIES
const Discord = require('discord.js');
const Winston = require('winston');
const {webhooks} = require('../data/auth.json');
const {ids} = require('../data/config.json');

class DiscordWH extends Winston.Transport{
	constructor(options){
		super(options);
		this.name = 'DiscordWH';
		this.level = options.level || 'info';
		this.client = new Discord.WebhookClient(options.wh.id, options.wh.token);
		this.client.listenerCount = function(){return 0;};
	};
	log(level, msg, meta, callback){
		const m = level.toUpperCase()=='ERROR' ? `<@${ids.owner}>` : '';
		const emb = new Discord.RichEmbed()
			.setTitle((level||'LOG').toUpperCase())
			.setColor((Winston.config.allColors[level] || 'DEFAULT').toUpperCase())
			.setDescription(msg||'LOG')
			.setTimestamp();
		this.client.send(m, emb)
			.catch((e)=>{
				console.log(`Couldn\'t log ${level} to Discord!`);
				console.error(e);
			});
		callback(null, true);
	};
};

Winston.transports.DiscordWH = DiscordWH;

const log = new Winston.Logger({
	transports: [
		new Winston.transports.Console({
			colorize: true,
			level: 'debug'
		}),
		new Winston.transports.File({
			filename: 'logs/bot.log',
			level: 'debug'
		}),
		new Winston.transports.DiscordWH({
			level: 'info',
			wh: webhooks.log
		})
	],
	padLevels: true,
	levels: Winston.config.npm.levels
});
const libLog = new Winston.Logger({
	transports: [
		new Winston.transports.Console({
			colorize: true,
			level: 'warn'
		}),
		new Winston.transports.File({
			filename: 'logs/library.log',
			level: 'debug'
		}),
		new Winston.transports.DiscordWH({
			level: 'warn',
			wh: webhooks.log
		})
	],
	levels: {error:0, warn:1, debug:2}
});

const usrLog = new Winston.Logger({
	transports: [
		new Winston.transports.File({
			filename: 'logs/users.log',
			level: 'debug'
		}),
		new Winston.transports.DiscordWH({
			level: 'info',
			wh: webhooks.usrLog
		})
	],
	levels: Winston.config.npm.levels
});

module.exports = {
	log: log,
	libLog: libLog,
	usrLog: usrLog
};
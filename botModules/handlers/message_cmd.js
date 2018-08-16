//DEPENDENCIES
const Discord = require('discord.js');
const {prefix} = require('../../data/config.json');
const {log} = require('../logger.js');
const moment = require('moment');

module.exports = {
	on: 'message_cmd',
	execute(message, matchedPrefix){
		const client = message.client;
		//====MESSAGE CHECKS====//
		/* const args = message.content.slice(matchedPrefix.length).trim().split(/,?\s+/);	//Old method for args, split by whitespace
		const commandName = args.shift().toLowerCase(); */
		let [,commandName, args] = message.content.slice(matchedPrefix.length).trim().match(/(\S+)\s*([^]*)/);
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if(!command) return;//quit if invalid command
		
		const delim = command.delim || ',?\\s+';
		if(delim!='none') args = args.split(new RegExp(delim)).filter(arg=>arg.length>0);

		//quit if guild command in DM
		if(command.guildOnly && message.channel.type != 'text') return message.channel.send(`**'${commandName}'** cannot be used in DM's!`);
		
		//quit if DM command in guild
		if(command.dmOnly && message.channel.type == 'text') return message.channel.send(`**'${commandName}'** can only be used in DM's!`);
		
		//quit if a user/role whitelist is defined and the user isn't on it
		if(command.users || command.roles){
			let allow = false;
			if(command.users && command.users.includes(message.author.id)) allow = true;
			if(command.roles && message.member && message.member.roles.some(role => command.roles.includes(role.id))) allow = true;
			if(!allow) return log.debug(`${command.name} not run - ${message.author.username} doesn't have permission.`);
		};

		//quit if not enough args
		if(command.args>args.length){
			let reply = `**'${commandName}'** requires at least ${command.args} arguments.`;
			if(command.usage){
				reply+= `\nThe proper usage would be: \`\`\`${prefix}${command.name} ${command.usage}\`\`\``;
			};
			return message.channel.send(reply);
		};

		//quit if command has a cooldown and user is cooling
		if(command.cooldown>0){
			if(!command.cooldowns) {
				command.cooldowns = new Discord.Collection();
			}
			const now = Date.now();
			const cooldownAmount = command.cooldown * 1000;

			if(command.cooldowns.has(message.author.id)) {
				const expirationTime = command.cooldowns.get(message.author.id);
				if(now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.channel.send(`You must wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
				};
			}else{
				command.cooldowns.set(message.author.id, now + cooldownAmount);
				setTimeout(() => command.cooldowns.delete(message.author.id), cooldownAmount);
			};
		};
		
		//====RUN CMD====//
		try{
			log.debug(`CMD-${commandName} for ${message.author.username} in `+(message.channel.type=='text' ? `${message.guild.name}/${message.channel.name}` : 'DM'));
			command.execute(message, args);
		}catch(err){
			let errMsg = `${command.name} errored! Details and stack below\n${'='.repeat(55)}\n  Date: ${moment().toISOString(true)}\n  Source: `;
			errMsg+= message.channel.type=='text' ? `${message.guild.name}/${message.channel.name}` : 'DM';
			errMsg+=`/${message.author.username}\n  Args:`;
			if(args.length>0){
				for(const x in args){
					errMsg+=`\n   ${x}:${args[x]}`;
				};
			}else{
				errMsg+='-none-';
			};
			errMsg+=`\n${'='.repeat(55)}\n${err.stack}\n${'='.repeat(55)}`;
			log.error(errMsg);
			const displayName = message.member ? message.member.displayName : message.author.username;
			message.channel.send(`There was an error executing ${displayName}'s **'${commandName}'** command!`);
		};
	}
};
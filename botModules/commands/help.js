const Discord = require('discord.js');
const {prefix, ids} = require('../../data/config.json');
const {log} = require('../logger.js');
module.exports = {
    name: 'help',
	aliases: ['commands', 'command'],
    desc: 'Get help with my commands.',
	usage: '[command name]',
    execute(message, args) {
		const server = message.guild || message.client.guilds.get('383264681462202380');
		const embed = new Discord.RichEmbed()
			.setColor(server.members.get(message.client.user.id).displayColor);
		const commands = message.client.commands.filter(command => {	//only list commands the user is authorised to use
			if(command.users || command.roles){
				const member = message.member || message.client.guilds.get(ids.homeSrv).members.get(message.author.id);
				if(command.users && command.users.includes(message.author.id)) return true;
				if(command.roles && member.roles.some(role => command.roles.includes(role.id))) return true;
				return false;
			}else{
				return true;
			};
		});

		if (!args.length){
			const msg = `Here\'s a list of all my commands. You can send \`${prefix}help [command name]\` to get more info on any specific command.`;
			embed.setDescription(commands.map(command => '**'+prefix+command.name+'** - '+command.desc).join('\n'));

			return message.author.send(msg, {split: true, embed:embed})
				.then(() => {
					if(message.channel.type != 'dm'){
						message.reply('I\'ve sent you a DM with all my commands!')
							.then(rep=> {
								rep.delete(60000);
								message.delete(60000);
							});
					};
				})
				.catch(error => {
					log.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}
		const commandName = args[0].toLowerCase();
		const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));

		if (!command){
			return message.reply('that\'s not a valid command!');
		}

		embed.setAuthor(prefix + command.name + (command.dmOnly?' (DMs only)':'') + (command.guildOnly?' (Servers only)':''));
		if(command.help||command.desc) embed.setDescription(command.help || command.desc);
		if(command.aliases) embed.addField('Aliases', command.aliases.join(', '));
		if(command.usage) embed.addField('Usage', `\`\`\`${prefix}${command.name} ${command.usage}\`\`\``);
		if(command.examples) embed.addField('Examples', `\`\`\`${command.examples.map(ex=>`${prefix}${command.name} ${ex}`).join('\n')}\`\`\``);
		if(command.cooldown) embed.addField('Cooldown', `${command.cooldown} seconds`);

		message.channel.send(embed)
			.then(rep=> {
				if(message.channel.type != 'dm'){
					rep.delete(60000);
					message.delete(60000);
				};
			});
    },
};
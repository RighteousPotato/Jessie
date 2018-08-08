module.exports = {
	commands: [
		{
			name: 'poop',
			aliases: ['poo', 'shit'],
			desc: 'Ping!',
			help: 'This is a long description of how to use this command.',
			cooldown: 5,
			execute(message, args) {
				message.channel.send('poop.');
			}
		},{
		    name: 'args-info',
			desc: 'Information about the arguments provided.',
			args: 3,
			execute(message, args) {
				if (args[0] === 'foo') {
					return message.channel.send('bar');
				}

				message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
			}
		},{
			name: 'role',
			desc: 'Check if a user has a role.',
			args: 2,
			usage: '<user> <role>',
			execute(message, args){
				message.reply(message.mentions.members.first().roles.has(message.mentions.roles.first().id));
			}
		}
	]
};
const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const {log} = require('../logger.js');

module.exports = {
    name: 'eval',
	users: [ids.owner],
	delim: 'none',
    desc: 'Eval...dangerous...careful...',
	help: 'Will attempt to eval all arguments as one block of code. For gods sake be careful.',
	args: 1,
    async execute(message, args) {
		message.delete();
		try{
			eval(args);
		}catch(err){
			const source = message.channel.type=='text' ? `${message.guild.name}/${message.channel.name}` : 'DM';
			const errMsg = `EVAL ERROR! Details and stack below\n${'='.repeat(55)}`
				+`\n\tDate: ${new Date().toJSON()}`
				+`\n\tSource: ${source}/${message.author.username}`
				+`\n${'='.repeat(55)}\n${args}\n${'='.repeat(55)}`
				+`\n${err.stack}\n${'='.repeat(55)}`;
			log.error(errMsg);
			return;
		};
		const ok = await message.channel.send('Eval complete 👍');
		ok.delete(3000);
	}
};
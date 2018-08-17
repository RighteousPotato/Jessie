//DEPENDENCIES
const Discord = require('discord.js');
const {log} = require('../logger.js');

module.exports = {
	on: 'messageReactionAdd_flagRep',
	async execute(message, messageReaction, user){
		const client = message.client;
		const emb = new Discord.RichEmbed(message.embeds[0]);
		if(messageReaction.emoji=='🗑'){
			try{
				const msg = await client.channels.get(emb.fields[0].value).fetchMessage(emb.fields[1].value);
				msg.delete();
				emb.setDescription(emb.description+`\n**Marked for deletion by ${user}.**`)
					.setTitle('Deleted message')
					.setColor('GREEN');
				const warnMsg = 'Your message (shown below) in *'+msg.channel+'* has been deleted.\n'
					+'It looks like you were trying to share a trainer code in a way that violates our rules.\n\n'
					+'If you wish to share your own code with an individual, please do so via a DM.\n'
					+'If you wish to share your own code with the whole server, send an image clearly showing your trainer name and trainer code in the *#trainer-codes* channel.\n\n'
					+'Before sharing your code in any way please be aware that doing so may allow other trainers to see limited information about your location and activities within the game.\n\n'
					+'If **anyone** is pressuring you to share your trainer code, please notify a member of our moderation team immediately.';
				const warnEmb = new Discord.RichEmbed()
					.setTitle('Deleted message')
					.setDescription('```'+msg.content+'```')
					.setFooter('Sent')
					.setTimestamp(new Date(msg.createdTimestamp));
				msg.author.send(warnMsg, warnEmb);
			}catch(e){
				let rsn;
				if(e.message && e.message==='Unknown Message'){
					rsn = 'Already deleted'
				}else{
					client.emit('error', e);
					rsn = 'Unknown error';
				};
				emb.setDescription(emb.description+`\n**Couldn't remove message. ${rsn}!**`)
					.setTitle('Error')
					.setColor('RED');
			};
		}else if(messageReaction.emoji=='🆗'){
			emb.setDescription(emb.description+`\n**Marked as OK by ${user}.**`)
				.setTitle('Message')
				.setColor('GREEN');
		};
		delete emb.fields;
		message.edit(message.content, emb);
		message.clearReactions();
	}
};
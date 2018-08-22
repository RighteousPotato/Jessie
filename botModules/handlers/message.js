//DEPENDENCIES
const {prefix, ids} = require('../../data/config.json');

module.exports = {
	on: 'message',
	execute(message){
		if(message.guild && message.guild.id===ids.homeSrv && message.author.id===ids.meowth
		&& message.embeds.length>0 && message.embeds[0].author && message.embeds[0].author.name==='Reporting Leaderboard (Total)'){
			message.client.emit('message_leaderboard', message);
			if(message.channel.id===ids.botChan) message.delete();
		};
		
		if(message.author.bot) return;//quit if from bot
		
		const prefixRegex = new RegExp(`^<@!?${message.client.user.id}>|^\\${prefix}`);
		if(prefixRegex.test(message.content)){
			const matchedPrefix = message.content.match(prefixRegex)[0];
			message.client.emit('message_cmd', message, matchedPrefix);
		};
		if(message.guild && message.guild.id===ids.homeSrv){
			const rgx = /(My Trainer Code is|\d{4}.{0,3}\d{4}.{0,3}\d{4})/i;
			if(rgx.test(message.content.replace(/<\S+(\d{18})>/g, ''))){
				message.client.emit('message_tCode', message);
			};
		};
		if(message.channel.id===ids.codeChan && !(message.attachments.first() && message.attachments.first().width)){
			const msg = 'Sorry, this channel is just for sharing trainer codes and your message will be deleted shortly.'
				+'\nIf you were trying to share your trainer code, send a message with an attached image which clearly shows your trainer code and trainer name.'
			message.client.emit('message_block', message, msg);
		};
	}
};
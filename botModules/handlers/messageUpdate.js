//DEPENDENCIES
const {prefix, ids} = require('../../data/config.json');

module.exports = {
	on: 'messageUpdate',
	execute(oldMessage, newMessage){
		if(newMessage.author.bot) return;//quit if from bot
		
		if(newMessage.guild && newMessage.guild.id===ids.homeSrv){
			const rgx = /(My Trainer Code is|\d{4}.{0,3}\d{4}.{0,3}\d{4})/i;
			if(rgx.test(newMessage.content.replace(/<\S+(\d{18})>/g, '')) && !rgx.test(oldMessage.content.replace(/<\S+(\d{18})>/g, ''))){
				newMessage.client.emit('message_tCode', newMessage);
			};
		};
	}
};
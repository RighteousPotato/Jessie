module.exports = {
	on: 'messageReactionAdd',
	execute(messageReaction, user){
		const message = messageReaction.message;
		const client = message.client;
		if(user.bot) return;
		if(message.author.id===client.user.id && message.embeds.length>0 && message.embeds[0].footer && message.embeds[0].footer.text==='Click a reaction to cast your vote!'){
			client.emit('messageReactionAdd_poll', message, messageReaction, user);
		};
		if(message.author.id===client.user.id && message.embeds.length>0 && message.embeds[0].title && message.embeds[0].title==='Flagged message'){
			client.emit('messageReactionAdd_flagRep', message, messageReaction, user);
		};
	}
};
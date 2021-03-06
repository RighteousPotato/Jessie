//DEPENDENCIES
const Discord = require('discord.js');
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

module.exports = {
	on: 'raw',
	async execute(event){
		if (!events.hasOwnProperty(event.t)) return;

		const { d: data } = event;
		const user = this.users.get(data.user_id);
		const channel = this.channels.get(data.channel_id) || await user.createDM();

		if (channel.messages.has(data.message_id)) return;

		const message = await channel.fetchMessage(data.message_id);
		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		let reaction = message.reactions.get(emojiKey);

		if (!reaction) {
			const emoji = new Discord.Emoji(this.guilds.get(data.guild_id), data.emoji);
			reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === this.user.id);
		}

		this.emit(events[event.t], reaction, user);
	}
};
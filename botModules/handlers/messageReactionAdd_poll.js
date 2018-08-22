//DEPENDENCIES
const Discord = require('discord.js');

module.exports = {
	on: 'messageReactionAdd_poll',
	execute(message, messageReaction, user){
		const client = message.client;
		if(message.mentions.users.size>0 && message.mentions.users.first().id===user.id && messageReaction.emoji==='⏹'){
			const embed = new Discord.RichEmbed(message.embeds[0]);
			const answers = embed.description.split('\n');
			const results = message.reactions.filter(reaction=>reaction.me).map(reaction=>reaction.count-1);
			const newDesc = answers.map((ans, ind)=>`**${ans.replace(/\S+ \- /,'')}** got ${results[ind]} vote(s)`).join('\n');

			embed.setTitle(embed.title + ' - Results:')
				.setDescription(newDesc)
				.setFooter('Voting now closed!', embed.footer.icon_url);

			message.edit(embed);
			if(message.channel.type != 'dm') message.clearReactions();
		};
	}
};
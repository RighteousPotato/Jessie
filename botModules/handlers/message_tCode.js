//DEPENDENCIES
const Discord = require('discord.js');
const {ids} = require('../../data/config.json');

module.exports = {
	on: 'message_tCode',
	execute(message){
		if(message.member.roles.has(ids.tre)) return;
		const emb = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTitle('Flagged message')
			.setDescription('```'+message.content+'```')
			.setURL(`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
			.addField('cID', message.channel.id, true)
			.addField('mID', message.id, true)
			.setFooter('Sent')
			.setTimestamp(new Date(message.createdTimestamp));
		message.client.channels.get(ids.modChan).send(`${message.author}'s message in ${message.channel} flagged as a trainer code.`, emb)
			.then(async post=>{
				await post.react('🗑');
				await post.react('🆗');
			});
	}
};
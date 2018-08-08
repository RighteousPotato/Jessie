const Discord = require('discord.js');

module.exports = {
    name: 'server',
	aliases: ['here', 'serv'],
	guildOnly: true,
    desc: 'See some details on the current server',
    async execute(message, args) {
		const server = message.guild;
		await server.fetchMembers();
		
		const {name, createdAt, owner, region} = server;		
		const memberCount = server.members.size;
		const botCount = server.members.filter(member=>member.user.bot).size;
		const humanCount = memberCount-botCount;
		
		const emb = new Discord.RichEmbed()
			.setColor(server.members.get(message.client.user.id).displayColor)
			.setTitle(`${name}`)
			.setThumbnail(server.iconURL)
			.addField('Created', createdAt.toString().match(/(.+\d{2} \d{4}) (\d{2}:\d{2})/)[1])
			.addField('Owner', owner.displayName)
			.addField('Region', region)
			.addField(`${memberCount} members`, `${humanCount} humans, ${botCount} bots`);
		message.channel.send(emb);
	}
};
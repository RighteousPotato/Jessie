const Discord = require('discord.js');
const {ids} = require('../../data/config.json');

module.exports = {
    name: 'teams',
	aliases: ['team', 'members'],
    desc: 'See how many people are on each team',
	help: 'Will reply with a breakdown of how many members there are on each team. Also shows bots and those not on a team.',
    async execute(message, args) {
		const teams = [{name: 'instinct', id: ids.instinct, count: 0},
				{name: 'valor', id: ids.valor, count: 0},
				{name: 'mystic', id: ids.mystic, count: 0},
				{name: 'harmony', id: '', count: 0},
				{name: 'bot', id: '', emoji: ':robot:', count: 0}
			];
		const server = message.client.guilds.get(ids.homeSrv);
		await server.fetchMembers();
		for(const ind in teams){
			if(!teams[ind].emoji) teams[ind].emoji = server.emojis.find(emoji=>emoji.name===teams[ind].name).toString();
		};
		server.members.forEach(member=>{
			const team = member.user.bot ? teams[4] : teams.find(x=>member.roles.has(x.id)) || teams[3];
			team.count++;
		});
		const emb = new Discord.RichEmbed()
			.setColor(server.members.get(message.client.user.id).displayColor)
			.setTitle(`${server.name} User Count`)
	.setDescription(`${server.members.size} Total (${server.members.size-teams[4].count} humans)`)
			.addField('\u200b', teams.filter((x, ind)=>ind%2===0).map(x=>x.emoji+' '+x.count).join('\n'), true)
			.addField('\u200b', teams.filter((x, ind)=>ind%2===1).map(x=>x.emoji+' '+x.count).join('\n'), true);
		message.channel.send(emb);
	}
};
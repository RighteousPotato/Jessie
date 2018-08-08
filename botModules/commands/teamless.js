const Discord = require('discord.js');
const {ids} = require('../../data/config.json');

module.exports = {
    name: 'teamless',
	aliases: ['newbies', 'noobs'],
    desc: 'See a list of people with no team.',
    async execute(message, args) {
		const teams = [ids.instinct, ids.valor, ids.mystic];
		const server = message.client.guilds.get(ids.homeSrv);
		await server.fetchMembers();
		const teamless = server.members.filter(member=>{
			return !member.user.bot && !member.roles.some(role=> teams.includes(role.id));
		}).sort((x, y)=>{
			return x.joinedTimestamp-y.joinedTimestamp
		});
		const msg = `Members not on a team. *(Sent messages tracked since ${message.client.startedAt.toDateString()})*\n`
			+teamless.map(member=>{
				let line = `**${member.displayName}**`
					+`\nJoined: ${member.joinedAt.toDateString()} | Last msg: `;
				if(member.lastMessage){
					line+=member.lastMessage.createdAt.toDateString();
				}else{
					line+='*None*';
				};
				return line;
			}).join('\n');
		message.channel.send(msg, {split:{append:'*(Continued below...)*\n'}});
	}
};
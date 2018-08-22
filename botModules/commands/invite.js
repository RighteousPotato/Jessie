const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const {log} = require('../logger.js');

module.exports = {
    name: 'invite',
	aliases: ['join'],
	guildOnly: true,
    desc: 'Get an invite to the server.',
	help: 'Will display an invite to the current server (If one is available).',
    async execute(message, args) {
		const server = message.guild;
		const invites = await server.fetchInvites();
		const everLastingInvites = invites.filter(inv=>{return inv.maxAge===0 && inv.maxUses===0});
		const invite = invites.get('3GuT9Ng') || everLastingInvites.first() || invites.first();
		if(!invite) return message.channel.send('There are no invites for this server :(');
		const emb = new Discord.RichEmbed()
			.setColor(server.members.get(message.client.user.id).displayColor)
			.setTitle(server.name)
			.setDescription(`To invite your friends to join, just give them this link:\n\n**${invite.url}**`)
			.setThumbnail(server.iconURL);
		if(invite.maxUses>0) emb.setFooter(`This invite will expire after ${invite.maxUses-invite.uses} more uses!`);
		if(invite.maxAge>0) emb.setFooter('This invite will expire').setTimestamp(invite.expiresAt);
		message.channel.send(emb);
	}
};
const Discord = require('discord.js');
const req = require('snekfetch');
const {ids} = require('../../data/config.json');
const {log} = require('../logger.js');

module.exports = {
    name: 'card',
	aliases: ['silph', 'trainer'],
    desc: 'Look at a users Silph Card',
	help: 'Will display a users Silph Road Traveller Card.',
	args: 1,
	usage: '<trainer name>',
    async execute(message, args) {
		let msg;
		try{
		const data = (await req.get(`https://sil.ph/${args[0]}.json`)).body.data;
			if(!data) throw 'Private';
			data.team = data.team.toLowerCase();
			const color = data.team==='teamless' ? 0 : message.client.guilds.get(ids.homeSrv).roles.get(ids[data.team]).color;
			const teamImg = message.client.emojis.find(emoji=>emoji.name==(data.team==='teamless' ? 'harmony' : data.team)).url;
			msg = new Discord.RichEmbed()
				.setColor(color)
				.setTitle(data.in_game_username + '\'s Traveler Card | The Silph Road')
				.setURL('https://sil.ph/' + data.in_game_username)
				.setThumbnail(data.avatar)
				.setDescription(cardBio(data))
				.setFooter('Last updated '+data.modified, teamImg)
				.addField('XP', data.xp, true)
				.addField('Caught', data.pokedex_count, true);
		}catch(e){
			if(e.status && e.status!=404) log.warn(`Card failed with code ${e.status}\n${e.message}\nhttps://sil.ph/${args[0]}.json`);
			msg = e==='Private' ? 'That card is marked as private.' : 'I couldn\'t find that card.';
		}finally{
			message.channel.send(msg);
		};
	}
};

function cardBio(data){
	let msg = 'A '+data.playstyle.toLowerCase()
			+' level **'+data.trainer_level+ '** '
			+data.team+' '+data.title.toLowerCase()+', **'
			+data.in_game_username
			+'** is focused on '+data.goal.toLowerCase();
	msg += (data.raid_average>0 ? ' and typically raids about '+data.raid_average+' times a week.' : '.');
	return msg;
};
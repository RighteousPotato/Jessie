const fs = require('fs');
const Discord = require('discord.js');
let board = require('../../data/leaderboard.json');
const path = '.\\data\\leaderboard.JSON';
const moment = require('moment');

module.exports = {
	on: 'message_leaderboard',
	async execute(message){
		const bChan = message.client.channels.get(board.channel);
		let bMsg = await bChan.fetchMessage(board.message);
		const embed = new Discord.RichEmbed(message.embeds[0])
			.setColor(message.guild.members.get(message.client.user.id).displayColor)
			.setFooter('Last updated')
			.setTimestamp();
		embed.author.name=`Reporting Leaderboard (${moment(message.createdAt).format('MMM')})`;

		if(bMsg.embeds[0].author.name != embed.author.name){
			bMsg = await bChan.send(embed);
			board.message = bMsg.id;
			try{
				fs.writeFileSync(path, JSON.stringify(board, null, 4));
				delete require.cache[require.resolve('../../data/leaderboard.json')];
				board = require('../../data/leaderboard.json');
			}catch(err){
				console.log('Error saving board ids');
				console.log(err);
			};
		}else{
			bMsg.edit(embed);
		};
	}
};
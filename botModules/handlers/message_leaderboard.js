const fs = require('fs');
let board = require('../../data/leaderboard.json');
const path = '.\\data\\leaderboard.JSON';

module.exports = {
	on: 'message_leaderboard',
	async execute(message){
		const bChan = message.client.channels.get(board.channel);
		let bMsg = await bChan.fetchMessage(board.message);

		if(bMsg.embeds[0].author.name != 'Reporting Leaderboard ('+ new Date().toDateString().match(/(\w*) (\w*) /)[2]+')'){
			bMsg = await bChan.send('*new board*');
			board.message = bMsg.id;
			try{
				fs.writeFileSync(path, JSON.stringify(board, null, 4));
				delete require.cache[require.resolve('../../data/leaderboard.json')];
				board = require('../../data/leaderboard.json');
			}catch(err){
				console.log('Error saving board ids');
				console.log(err);
			};
		};
		const embed = message.embeds[0].toRichEmbed()
			.setColor(message.guild.members.get(message.client.user.id).displayColor)
			.setFooter('Last updated');
		embed.author.name='Reporting Leaderboard ('+ new Date().toDateString().match(/(\w*) (\w*) /)[2]+')';
		bMsg.edit(embed);
	}
};
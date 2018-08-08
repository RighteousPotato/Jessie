const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const eNos = ['1⃣', '2⃣', '3⃣', '4⃣',
	'5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟']
const eStop = '⏹';
const pollLogo = 'https://raw.githubusercontent.com/RighteousPotato/Jessie/master/data/images/poll.png';
const {log} = require('../logger.js');

module.exports = {
    name: 'poll',
	aliases: ['vote', 'ask'],
	delim: '\\n+',
    desc: 'Create a poll',
	args: 3,
	help: 'Will create a new poll. First specify the question and then between two and ten options. Each option should be on a new line within the same message.'
		+'\nThe poll author can press '+eStop+' at any time to close the voting',
	usage: '<question>\n<option1>\n<option2>\n[option3]\n...\n[option10]',
	examples:['Which is the best team?\nInstinct\nValor\nMystic'],
    execute(message, args) {
		const question = args.shift();
		const answers = args.slice(0,10);
		const server = message.guild || message.client.guilds.get(ids.homeSrv);
		const auth = Object.assign({}, message.author);
		const emb = new Discord.RichEmbed()
			.setColor(server.members.get(message.client.user.id).displayColor)
			.setAuthor(message.member ? message.member.displayName : message.author.username, message.author.displayAvatarURL)
			.setTitle(question)
			.setDescription(answers.map((answer, ind)=> eNos[ind]+' - '+answer).join('\n'))
			.setFooter('Click a reaction to cast your vote!', pollLogo);

		message.channel.send(`New poll from ${message.author}`, emb)
			.then(async post=>{
				try{
					for(eNo of eNos.slice(0,answers.length)){
						await(post.react(eNo));
					};
					await(post.react(eStop));
					if(message.deletable) message.delete();
				}catch(e){
					post.clearReactions();
					post.edit('Something went wrong making this poll. Sorry!', {embed:null});
					log.error(e);
				};
			});
	}
};
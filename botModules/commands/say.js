const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
module.exports = {
    name: 'say',
    desc: 'Have the bot say something',
	help: 'Will reply with the arguments you sent and delete your message. Send with no arguments to start an interactive session to say something in a different channel.',
	users: [ids.owner],
    async execute(message, args){
		if(args.length>0){
			message.delete();
			return message.channel.send(args.join(' '));
		};
		const q1 = await message.channel.send('Where do you want me to say something?');
		try{
			const r1 = (await message.channel.awaitMessages(resp=> resp.mentions.channels.size>0, {maxMatches: 1, time: 30000, errors:['time']})).first();
			q1.delete();
			r1.delete();
			const target = r1.mentions.channels.first();
			
			const q2 = await message.channel.send(`What do you want to say in ${target}?`);
			try{
				const r2 = (await message.channel.awaitMessages(response=>response.author.id==message.author.id, {maxMatches: 1, time: 60000, errors:['time']})).first();
				q2.delete();
				r2.delete();
				
				const msg = r2.content;
				try{
					await target.send(msg);
					message.channel.send('Said `'+msg+'` in '+target+'.');
				}catch(e){
					message.channel.send('Failed to send message! '+ (e.message ? `(${e.message})` : ''));
				};
			}catch(e){
				message.channel.send('Timed out. You need to reply with a message to send within 60 seconds.');
			};
		}catch(e){
			message.channel.send('Timed out. You need to reply with a #channel mention within 30 seconds.');
		};
	}
};
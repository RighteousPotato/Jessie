const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const emoji = ['✅', '❎'];//tick, cross

module.exports = {
    name: 'announce',
    desc: 'Have the bot announce something',
	help: 'Will reply with the arguments you sent and delete your message. Send with no arguments to start an interactive session to say something in a different channel.',
	users: [ids.owner],
    async execute(message, args){
		const msgFilter = (response)=>{
			return response.author.id===message.author.id;
		};
		const reactFilter = (reaction, user)=>{
			return emoji.includes(reaction.emoji.name) && user.id===message.author.id;
		};
		const options = {max: 1, time: 10000, errors: ['time']};
		const confirm = async (field)=>{
			const conf = await message.channel.send('Does that look right?');
			for(emj of emoji){
				await conf.react(emj);
			};
			reaction = (await conf.awaitReactions(reactFilter, options)).first().emoji.name;
			conf.delete();
			return reaction;
		};
		
		
		const server = message.guild || message.client.guilds.get(ids.homeSrv);
		let target;
		let msg = '';
		const embed = new Discord.RichEmbed()
			.setColor(server.members.get(message.client.user.id).displayColor)
			.setAuthor(message.member ? message.member.displayName : message.author.username, message.author.displayAvatarURL)
			.setTimestamp();
		try{
			const preview = await message.channel.send(embed);
			try{
				while(true){
					const q = await message.channel.send('What should the title be?\n*Reply with `none` to leave blank*');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.content==='none') break;
					embed.setTitle(ans.content);
					await preview.edit(embed);
					let reaction = await confirm();
					if(reaction===emoji[0]) break;
					delete embed.title;
					await preview.edit(embed);
				};
				while(true){
					const q = await message.channel.send('What should the description be?\n*Reply with `none` to leave blank*');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.content==='none') break;
					embed.setDescription(ans.content);
					await preview.edit(embed);
					let reaction = await confirm();
					if(reaction===emoji[0]) break;
					delete embed.description;
					await preview.edit(embed);
				};
				while(true){
					const q = await message.channel.send('What should the image be?\n*Reply with `none` to leave blank*');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.content==='none') break;
					try{
						embed.setImage(ans.content);
						await preview.edit(embed);
					}catch(e){
						delete embed.image;
						const errM = await message.channel.send('**That doesn\'t seem to be a valid URL!**');
						errM.delete(5000);
						continue;
					};
					let reaction = await confirm();
					if(reaction===emoji[0]) break;
					delete embed.image;
					await preview.edit(embed);
				};
				while(true){
					const q = await message.channel.send('What should the thumbnail be?\n*Reply with `none` to leave blank*');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.content==='none') break;
					try{
						embed.setThumbnail(ans.content);
						await preview.edit(embed);
					}catch(e){
						delete embed.thumbnail;
						const errM = await message.channel.send('**That doesn\'t seem to be a valid URL!**');
						errM.delete(5000);
						continue;
					};
					let reaction = await confirm();
					if(reaction===emoji[0]) break;
					delete embed.thumbnail;
					await preview.edit(embed);
				};
				while(true){
					const q = await message.channel.send('What should the footer be?\n*Reply with `none` to leave blank*');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.content==='none') break;
					embed.setFooter(ans.content);
					await preview.edit(embed);
					let reaction = await confirm();
					if(reaction===emoji[0]) break;
					delete embed.footer;
					await preview.edit(embed);
				};
				while(true){
					const q = await message.channel.send('To add a field, reply with a title and value separated by a comma, or `none` to continue.');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.content==='none') break;
					const ansSplit = ans.content.split(/,+\s*/).filter(arg=>arg.length>0);
					try{
						embed.addField(ansSplit[0], ansSplit[1]);
						await preview.edit(embed);
					}catch(e){
						const errM = await message.channel.send('**That doesn\'t seem to be a valid format!**');
						errM.delete(5000);
						continue;
					};
					let reaction = await confirm();
					if(reaction===emoji[1]){
						embed.fields.pop();
						await preview.edit(embed);
					};
				};
				while(true){
					const q = await message.channel.send('Where you do want to send the announcement?');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(ans.mentions.channels.size===0){
						const errM = await message.channel.send('**You need to reply with a #channel mention!**');
						errM.delete(5000);
						continue;
					};
					target = ans.mentions.channels.first();
					break;
				};
				while(true){
					const q = await message.channel.send('Do you want to tag everyone? *(yes/no)*.');
					const ans = (await message.channel.awaitMessages(msgFilter, options)).first();
					q.delete();
					ans.delete();
					if(!['yes', 'no'].includes(ans.content.toLowerCase())){
						const errM = await message.channel.send('**You need to reply with either yes or no!**');
						errM.delete(5000);
						continue;
					};
					if(ans.content.toLowerCase()==='yes') msg = '@everyone';
					break;
				};
				await preview.edit(`Below is your completed announcement. Proceed to post this in ${target}?`, embed);
				for(emj of emoji){
					await preview.react(emj);
				};
				reaction = (await preview.awaitReactions(reactFilter, options)).first().emoji.name;
				if(reaction===emoji[0]){
					target.send(msg, embed);
					preview.edit('Announcement sent!');
				}else{
					preview.edit('Cancelled!');
				};
				
			}catch(e){
				console.error(e);
				preview.edit('Timed out!', {embed: null});
			};
		}catch(e){
			console.error(e);
		};
	}
};
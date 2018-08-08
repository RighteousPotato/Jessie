const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const eTick = '✅';
const eCross = '❎';

module.exports = {
    name: 'delete',
	aliases: ['remove', 'del'],
	roles: [ids.tre],
	guildOnly: true,
    desc: 'Delete a channel',
	help: 'Will delete the current channel.',
    async execute(message, args) {
		let allowedUsers = [];
		if(this.users) allowedUsers = allowedUsers.concat(this.users);
		if(this.roles){
			const uIDs = message.guild.members
				.filter(member=>member.roles.some(role=> this.roles.includes(role.id)))
				.map(member=>member.id);
			allowedUsers = allowedUsers.concat(uIDs);
		};
		
		const channel = message.channel;
		const resp = await channel.send('Are you sure you want to delete this channel?\n*(Please use `!duplicate` if this is a raid channel)*');
		await resp.react(eTick);
		await resp.react(eCross);
		
		const filter = (reqd, reaction, user)=>{
			return reqd.includes(reaction.emoji.name) && allowedUsers.includes(user.id);
		};
		const cancel = function(){
			message.delete(10000);
			resp.clearReactions();
			resp.edit('Deletion canceled');
			resp.delete(10000);
		};
		try{
			const collA = await resp.awaitReactions(filter.bind(null, [eTick, eCross]), {max: 1, time: 30000, errors: ['time']});
			resp.clearReactions();
			if(collA.firstKey()==eTick){
				await resp.clearReactions();
				await resp.edit(`This channel will be deleted in 30 seconds.\nIf this was done in error click the cross below to cancel.`);
				await resp.react(eCross);
				try{
					const collB = await resp.awaitReactions(filter.bind(null, [eCross]), {max: 1, time: 30000});
					if(collB.size==0){
						channel.delete();
					}else{
						cancel();
					};
				}catch(e){
					cancel();
				};
			}else{
				cancel();
			};
		}catch(e){
			cancel();
		};				
	}
};
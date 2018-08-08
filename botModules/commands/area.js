const Discord = require('discord.js');
const {prefix, ids} = require('../../data/config.json');
const {log} = require('../logger.js');

const mapImg = 'https://raw.githubusercontent.com/RighteousPotato/Jessie/master/data/images/rMap_flat.png';

module.exports = {
    name: 'area',
	aliases: ['areas', 'notify', 'notifications'],
    desc: 'Manage area subscriptions',
	help: 'Change which areas you are/aren\'t subscribed to, or use no arguments to see your current subscriptions.'
		+'\nBy default, your status will be toggled in each of the areas you list, or you can specify \'add\' or \'remove\' to limit the action taken. You can also say \'all\' in place of area names.',
	usage: '[add|remove|toggle] [list of areas|all]',
	examples:['north', 'north, south, town', 'remove all'],
    execute(message, args) {
		const server = message.client.guilds.get('383264681462202380');//message.guild || message.client.guilds.get('383264681462202380');
		const member = server.members.get(message.author.id);//message.member || server.members.get(message.author.id);
		const areaRoles = ids.areas.map(id => server.roles.get(id));
		
		if(args.length==0){
			let flds = [
				{name:'Subscribed', value:'', inline:true},
				{name:'Not Subscribed', value:'', inline:true}
			];
			for(x in areaRoles){
				if(member.roles.has(areaRoles[x].id)){
					flds[0].value+=`\n${areaRoles[x].name}`;
				}else{
					flds[1].value+=`\n${areaRoles[x].name}`;
				};
			};
			if(flds[0].value=='') flds[0].value = '*You aren\'t subscribed\nto any areas*';
			if(flds[1].value=='') flds[1].value = '*You\'re subscribed\nto all areas*';
			
			const msg = 'Below is the current status of your area subscrptions. To change your status in a given area,'
				+' use `'+prefix+'area <area name>` or you can use `'+prefix+'area <list of areas>` to change multiple areas at once.'
				+'\n\nBy default, your status will be toggled in each of the areas you list, but you can specify ***\'add\'*** or ***\'remove\'*** to limit the action taken.'
				+' You can also use ***\'all\'*** in place of a list of areas to change all areas at once.';
			const emb = new Discord.RichEmbed()
				.setColor(server.members.get(message.client.user.id).displayColor)
				.setTitle('Raid Areas')
				.setImage(mapImg)
				.setFooter('Use \''+prefix+'help area\' for more help and examples');
			emb.fields = flds;
			message.author.send(msg, {embed:emb})
				.then(() => {
					if(message.channel.type != 'dm'){
						message.delete(5000);
						message.reply('I\'ve sent you a DM about areas!')
							.then(sent=>sent.delete(10000));
					};
				})
				.catch(error => {
					log.error(`Could not send area DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}else{
			let mode = args.find(arg => ['add','remove','toggle'].includes(arg)) || 'toggle';
			if(args.includes('all')){
				args = areaRoles.map(role => role.name)
			}else{
				args = args.filter(arg => !['add','remove','toggle'].includes(arg));
			};
			let newRoles = member.roles.clone();
			let added = [];
			let removed = [];
			let invalid = [];
			
			for(x in args){
				const role = areaRoles.find(role => role.name.toLowerCase()==args[x].toLowerCase());
				if(role){
					if(newRoles.has(role.id) && mode!='add'){
						newRoles.delete(role.id);
						removed.push(role.name);
					}else if(!newRoles.has(role.id) && mode!='remove'){
						newRoles.set(role.id, role);
						added.push(role.name);
					};
				}else{
					invalid.push(args[x]);
				};
			};
			if(!newRoles.equals(member.roles)){
				member.setRoles(newRoles)
					.then(function(){
						let msg = '';
						if(added.length>0) msg+=`Added to ${added.join(', ')}\n`;
						if(removed.length>0) msg+=`Removed from ${removed.join(', ')}\n`;
						if(invalid.length>0) msg+=`I didn't recognise the following areas: ${invalid.join(', ')}`;
						message.reply(msg)
					})
					.catch(error => {
						log.error(`Could not update ${message.author.tag}'s roles.\n`, error);
						message.reply('there was an error updating your raid areas');
					});
			}else if(invalid.length>0){
				message.reply('I didn\'t recognise any of those areas.');
			}else{
				message.reply('You\'re already '+(mode=='add'?'subscribed to all':'not subscribed to any')+' of those areas.');
			};
		};
	}
};
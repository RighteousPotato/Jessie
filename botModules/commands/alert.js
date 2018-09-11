const Discord = require('discord.js');
const {prefix, ids} = require('../../data/config.json');
const {log} = require('../logger.js');

const mapImg = 'https://raw.githubusercontent.com/RighteousPotato/Jessie/master/data/images/rMap_flat.png';

module.exports = {
    name: 'alert',
	aliases: ['alerts', 'area', 'areas', 'notify', 'notifications', 'groups'],
    desc: 'Manage @tag subscriptions',
	help: 'Change which alerts you are/aren\'t subscribed to, or use no arguments to see your current subscriptions.'
		+'\nBy default, your status will be toggled for each of the alerts you list, or you can specify \'add\' or \'remove\' to limit the action taken. You can also say \'all\' in place of alert names.',
	usage: '[add|remove|toggle] [list of alerts|all]',
	examples:['100', 'EXGym', 'north', 'north, south, town', 'remove all'],
    execute(message, args) {
		const server = message.client.guilds.get('383264681462202380');//message.guild || message.client.guilds.get('383264681462202380');
		const member = server.members.get(message.author.id);//message.member || server.members.get(message.author.id);
		const alertRoles = ids.alerts.map(id => server.roles.get(id));
		
		if(args.length===0){
			let flds = [
				{name:'Subscribed', value:'', inline:true},
				{name:'Not Subscribed', value:'', inline:true}
			];
			for(x in alertRoles){
				if(member.roles.has(alertRoles[x].id)){
					flds[0].value+=`\n${alertRoles[x].name}`;
				}else{
					flds[1].value+=`\n${alertRoles[x].name}`;
				};
			};
			if(flds[0].value==='') flds[0].value = '*You aren\'t subscribed\nto any alerts*';
			if(flds[1].value==='') flds[1].value = '*You\'re subscribed\nto all alerts*';
			
			const msg = 'Below is the current status of your alert subscrptions. To change your status for a given alert,'
				+' use `'+prefix+'alert <alert name>` or you can use `'+prefix+'alert <list of alerts>` to change multiple alerts at once.'
				+'\n\nBy default, your status will be toggled for each of the alerts you list, but you can specify ***\'add\'*** or ***\'remove\'*** to limit the action taken.'
				+' You can also use ***\'all\'*** in place of a list of alerts to change all alerts at once.';
			const emb = new Discord.RichEmbed()
				.setColor(server.members.get(message.client.user.id).displayColor)
				.setTitle('Maidstone Alerts')
				.setImage(mapImg)
				.setFooter('Use \''+prefix+'help alert\' for more help and examples');
			emb.fields = flds;
			message.author.send(msg, {embed:emb})
				.then(() => {
					if(message.channel.type != 'dm'){
						message.delete(5000);
						message.reply('I\'ve sent you a DM about alerts!')
							.then(sent=>sent.delete(10000));
					};
				})
				.catch(error => {
					log.error(`Could not send alert DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}else{
			let mode = args.find(arg => ['add','remove','toggle'].includes(arg)) || 'toggle';
			if(args.includes('all')){
				args = alertRoles.map(role => role.name)
			}else{
				args = args.filter(arg => !['add','remove','toggle'].includes(arg));
			};
			let newRoles = member.roles.clone();
			let added = [];
			let removed = [];
			let invalid = [];
			
			for(x in args){
				const role = alertRoles.find(role => role.name.toLowerCase()===args[x].toLowerCase());
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
						if(invalid.length>0) msg+=`I didn't recognise the following alerts: ${invalid.join(', ')}`;
						message.reply(msg)
					})
					.catch(error => {
						log.error(`Could not update ${message.author.tag}'s roles.\n`, error);
						message.reply('there was an error updating your alerts');
					});
			}else if(invalid.length>0){
				message.reply('I didn\'t recognise any of those alerts.');
			}else{
				message.reply('You\'re already '+(mode==='add'?'subscribed to all':'not subscribed to any')+' of those alerts.');
			};
		};
	}
};
const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const fs = require('fs');
const path = '.\\data\\untrusted.json';

module.exports = {
    name: 'trust',
	aliases: ['untrust'],
	roles: [ids.tre],
	guildOnly: true,
    desc: 'Add/remove the Trusted role to a user',
	help: 'Will toggle the mentioned users membership in the trusted role.'
		+'Users un-trusted in this way will not be automatically re-trusted.',
	args: 1,
	usage: '<@user>',
    async execute(message, args) {
		if(message.mentions.members.size===0) return message.channel.send('You didn\'t mention a user!');
		const target = message.mentions.members.first();
		const untrusted = JSON.parse(fs.readFileSync(path));
		
		if(target.roles.has(ids.trusted)){
			if(!untrusted.includes(target.id)) untrusted.push(target.id);
			target.removeRole(ids.trusted)
				.then(message.channel.send(`${target} un-trusted.`))
				.catch(e=>message.channel.send(`There was an error un-trusting ${target}.`));
		}else{
			if(untrusted.includes(target.id)) untrusted.splice(untrusted.indexOf(target.id), 1);
			target.addRole(ids.trusted)
				.then(message.channel.send(`${target} trusted.`))
				.catch(e=>message.channel.send(`There was an error trusting ${target}.`));
		};
		try{
			fs.writeFileSync(path, JSON.stringify(untrusted, null, 4));
		}catch(err){
			console.log('Error saving member list');
			console.log(err);
		};
	}
};
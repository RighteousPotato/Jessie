const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'auth',
    desc: '(De)Authorise a user/role(s) to use a command',
	users: ['338583610741227521'],
    execute(message, args) {
		const mode = args[0].match(/add|remove/i);
		const command = message.client.commands.get(args[1]);
		const changed = [];
		if(!mode) return message.channel.send(`${args[0]} is not a valid. It should be **add** or **remove**.`);
		if(!command) return message.channel.send(`${args[1]} is not a valid command.`);
		if(!command.roles && message.mentions.roles.array().length>0) command.roles=[];
		if(!command.users && message.mentions.users.array().length>0) command.users=[];

		for(const [,role] of message.mentions.roles){
			const index = command.roles.indexOf(role.id);
			if(index==-1&&mode=='add'){
				command.roles.push(role.id);
				changed.push(message.guild.roles.get(role.id));
			}else if(index!=-1&&mode=='remove'){
				command.roles.splice(index,1);
				changed.push(message.guild.roles.get(role.id));
			};
		};
		if(command.roles && command.roles.length==0) delete command.roles;
		
		for(const [,user] of message.mentions.users){
			const index = command.users.indexOf(user.id);
			if(index==-1&&mode=='add'){
				command.users.push(user.id);
				changed.push(message.client.users.get(user.id));
			}else if(index!=-1&&mode=='remove'){
				command.users.splice(index,1);
				changed.push(message.client.users.get(user.id));
			};
		};
		if(command.users && command.users.length==0) delete command.users;
		
		let msg = '';
		if(command.roles || command.users){
			if(command.roles) msg+=`Allowed roles:\n${command.roles.map(role=>message.guild.roles.get(role)).join('\n')}\n`;
			if(command.users) msg+=`Allowed users:\n${command.users.map(user=>message.client.users.get(user)).join('\n')}`;
		}else{
			msg = `${command.name} is unrestricted.`;
		};
		message.channel.send(msg);
	//TODO Insert logic to save back to file
		let cmdArr = [];
		for(let prop in command){
			if(typeof(command[prop])=='function'){
				cmdArr.push(command[prop]);
			}else if(Array.isArray(command[prop])){
				cmdArr.push(prop+': ['+command[prop].map(elem=>'\''+elem+'\'')+']');
			}else if(typeof(command[prop])=='string'){
				cmdArr.push(prop+': \''+command[prop]+'\'');
			}else{
				cmdArr.push(prop+': '+command[prop]);
			};
		};
		fs.writeFileSync('abc.txt', `module.exports = {\n\t${cmdArr.join(',\n\t')}\n};`, 'utf-8');
	}
};
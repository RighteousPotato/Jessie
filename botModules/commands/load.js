const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
module.exports = {
    name: 'load',
    desc: 'Reload some or all bot components',
	desc: 'Reload some or all bot components. This is just here to make the text longer.',
	usage: '[commands|handlers|jobs|all]',
	users: [ids.owner],
    execute(message, args) {
		if(args.includes('all')) args = ['commands', 'handlers', 'jobs'];
		if(args.includes('commands')){
			const oldList = message.client.commands ? message.client.commands.map(command=> command.name) : [];
			message.client.loadCommands();
			const newList = message.client.commands.map(command=> command.name);
			const removedCmds = oldList.filter(command=> !newList.includes(command));
			const addedCmds = newList.filter(command=> !oldList.includes(command));
			let msg = `${newList.length} commands loaded.`;
			if(removedCmds.length>0){
				msg+=`\n${removedCmds.length} commands removed:\n`;
				msg+=`-${removedCmds.join('\n-')}`;
			};
			if(addedCmds.length>0){
				msg+=`\n${addedCmds.length} commands added:\n`;
				msg+=`-${addedCmds.join('\n-')}`;
			};
			message.channel.send(msg);
		};
		if(args.includes('handlers')){
			const oldList = message.client.handlers ? message.client.handlers.map((value, key)=> key) : [];
			message.client.loadHandlers();
			const newList = message.client.handlers.map((value, key)=> key);
			const removedHands = oldList.filter(handler=> !newList.includes(handler));
			const addedHands = newList.filter(handler=> !oldList.includes(handler));
			let msg = `${newList.length} handlers loaded.`;
			if(removedHands.length>0){
				msg+=`\n${removedHands.length} handlers removed:\n`;
				msg+=`-${removedHands.join('\n-')}`;
			};
			if(addedHands.length>0){
				msg+=`\n${addedHands.length} handlers added:\n`;
				msg+=`-${addedHands.join('\n-')}`;
			};
			message.channel.send(msg);
		};
		if(args.includes('jobs')){
			const oldList = message.client.jobs ? message.client.jobs.map((value, key)=> key) : [];
			message.client.loadJobs();
			const newList = message.client.jobs.map((value, key)=> key);
			const removedJobs = oldList.filter(job=> !newList.includes(job));
			const addedJobs = newList.filter(job=> !oldList.includes(job));
			let msg = `${newList.length} jobs loaded.`;
			if(removedJobs.length>0){
				msg+=`\n${removedJobs.length} jobs removed:\n`;
				msg+=`-${removedJobs.join('\n-')}`;
			};
			if(addedJobs.length>0){
				msg+=`\n${addedJobs.length} jobs added:\n`;
				msg+=`-${addedJobs.join('\n-')}`;
			};
			message.channel.send(msg);
		};
	}
};
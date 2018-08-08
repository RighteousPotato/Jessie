const {ids} = require('../config.json');
module.exports = {
    name: 'loadcmds',
    desc: 'Reload commands',
	users: [ids.owner],
    execute(message, args) {
		const oldList = message.client.commands.map(command=> command.name);
		message.client.loadCommands();
		const newList = message.client.commands.map(command=> command.name);
		const removedCmds = oldList.filter(command=> !newList.includes(command));
		const addedCmds = newList.filter(command=> !oldList.includes(command));
		let msg = `${newList.length} commands loaded.`;
		if(removedCmds.length+addedCmds.length==0){
			msg+='\nNo commands added/removed.';
		}else{
			if(removedCmds.length>0){
				msg+=`\n${removedCmds.length} commands removed:\n`;
				msg+=`-${removedCmds.join('\n-')}`;
			};
			if(addedCmds.length>0){
				msg+=`\n${addedCmds.length} commands added:\n`;
				msg+=`-${addedCmds.join('\n-')}`;
			};
		};
		message.channel.send(msg);
	}
};
const Discord = require('discord.js');
const {ids} = require('../../data/config.json');

module.exports = {
    name: 'create',
	aliases: ['channel', 'chan'],
	roles: [ids.trusted],
	guildOnly: true,
    desc: 'Create a new channel',
	help: 'Will create a new channel in the same category as the current channel.',
	args: 1,
	usage: '<new channel name>',
    async execute(message, args) {
		const newChan = await message.guild.createChannel(args.join('-'), 'TEXT', message.channel.permissionOverwrites)
		await newChan.setParent(message.channel.parentID);
		message.channel.send(`<#${newChan.id}> created!`);
		const dStr = new Date().toString().match(/(.+\d{2} \d{4}) (\d{2}:\d{2})/);
		newChan.send(`<@${message.author.id}> created this channel on ${dStr[1]} at ${dStr[2]}.`);
	}
};
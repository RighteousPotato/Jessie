const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const moment = require('moment');

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
		newChan.send(`<@${message.author.id}> created this channel on ${moment().format('DD/MM/YY [at] h:mm A')}.`);
	}
};
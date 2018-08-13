//DEPENDENCIES
const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const {usrLog} = require('../logger.js');

module.exports = {
	on: 'guildMemberRemove',
	execute(member){
		if(member.guild.id!=ids.homeSrv) return;
		
		usrLog.warn(`A user left the server!\n${member.nickname||member.user.username} / ${member.id}`);
	}
};
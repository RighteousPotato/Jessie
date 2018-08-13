//DEPENDENCIES
const Discord = require('discord.js');
const {ids} = require('../../data/config.json');
const {usrLog} = require('../logger.js');

module.exports = {
	on: 'guildMemberAdd',
	execute(member){
		if(member.guild.id!=ids.homeSrv) return;
		
		usrLog.info(`A user joined the server!\n${member.nickname||member.user.username} / ${member.id}`);
	}
};
/**************************************************
##	A Discord.js self bot. Useful for talking
##	to other bots.
**************************************************/

//DEPENDENCIES
const Discord = require('discord.js');
const {sbToken} = require('../data/auth.json');
const {log, libLog} = require('./logger.js');
const {ids} = require('../data/config.json');

const sb = new Discord.Client();
sb.on('warn', msg=>{
	libLog.warn('SB: '+msg)
});
sb.on('error', e=>{
	if(e.type) libLog.error('SB: '+e.type);
	if(e.message) libLog.error('SB: '+e.message);
	if(e.error) libLog.error('SB: '+e.error);
	const extraKeys = Object.keys(e).filter(key=>!['type', 'message', 'error'].includes(key));
	if(extraKeys.length>0) libLog.error(`SB: Unlogged keys: ${extraKeys.join(', ')}`);
});

sb.on('ready', function(){
	log.info('SB Ready');
});
sb.on('resume', function(){
	log.info('SB Resumed');
});

sb.allAvailable = function(arg){
	if(!this.guilds.has(ids.homeSrv)) return log.error(`SB doesn\'t have access to homeSrv, can\'t ${arg}`);
	const guild = this.guilds.get(ids.homeSrv);
	if(!guild.available || !guild.channels.has(ids.botChan) ) return log.error(`SB doesn\'t have access to botChan, ${arg}`);
	if(!guild.members.has(ids.meowth) || guild.members.get(ids.meowth).presence.status=='offline') return log.error(`Meowth is offline, can\'t ${arg}`);
	return true;
};

sb.reqBoard = function(){
	if(!this.allAvailable('reqBoard')) return;
	const guild = this.guilds.get(ids.homeSrv);
	const chan = guild.channels.get(ids.botChan);			
	chan.send('!leaderboard')
		.then(function(message){
			message.delete(10000);
		})
		.catch(function(e){
			log.error('Couldn\'t request leaderboard');
		});
}
sb.resetBoard = async function(user='all'){
	if(!this.allAvailable('resetBoard')) return;
	log.debug(`Resetting leaberboard for ${user} (${user.username}).`);
	const msgFilter = (response)=>{
		return response.author.id==ids.meowth;
	};
	const reactFilter = (reaction, reactor)=>{
		return reaction.emoji.name=='❎' && reactor.id==ids.meowth;
	};
	const options = {max: 1, time: 10000, errors: ['time']};
	
	const guild = this.guilds.get(ids.homeSrv);
	const chan = guild.channels.get(ids.botChan);
	chan.send(`!reset_board ${user}`);
	
	const conf = (await chan.awaitMessages(msgFilter, options)).first();
	try{
		await conf.awaitReactions(reactFilter, options);
	}catch(e){};
	conf.react('✅');
};

sb.login(sbToken);
module.exports = sb;
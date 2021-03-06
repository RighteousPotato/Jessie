const {ids} = require('../../data/config.json');
const {log, usrLog} = require('../logger.js');
const fs = require('fs');
const path = '.\\data\\untrusted.json';
const sb = require('../sb.js');

module.exports = {
	schedule: {hour: 23, minute: 30},
	async job(){
		if(!this.guilds.has(ids.homeSrv)) return log.error('Client doesn\'t have access to homeSrv, can\'t run eveningTasks');
		const server = this.guilds.get(ids.homeSrv);

		if(!server.available) return log.error('Client doesn\'t have access to homeSrv, can\'t run eveningTasks');
		const untrusted = JSON.parse(fs.readFileSync(path));
		const now = new Date();
		const adds = [];
		const errs = [];
		await server.fetchMembers();
		const targets = server.members.filter(member=>{return !member.user.bot && !untrusted.includes(member.id) && !member.roles.has(ids.trusted) && now-member.joinedAt>86400000});
		for(const [,member] of targets){
			try{
				await member.addRole(ids.trusted);
				adds.push(member);
			}catch(e){
				console.error(e);
				errs.push(member);
			};
		};
		const msg = `${adds.length} member(s) trusted:\n` + adds.map(mem=>` - ${mem.displayName}`).join('\n');
		const eMsg = `<@${ids.owner}> Failed to give the trusted role to ${errs.length} members!\n` + errs.map(mem=>` - ${mem.displayName}`).join('\n');
		if(adds.length>0) usrLog.info(msg);
		if(errs.length>0) usrLog.error(eMsg);

		try{
			const glen = await this.fetchUser('294950541572702219');
			sb.resetBoard(glen);
		}catch(e){
			log.error('Couldn\'t retrieve Glen\'s user! Stats not reset!');
			log.warn(e);
		};
	}
};
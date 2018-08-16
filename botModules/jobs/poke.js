const {sbToken,ids} = require('../../data/config.json');
const {log} = require('../logger.js');

const ind = {
	lucy: '378472522372481024',
	glen: '294950541572702219'
};

module.exports = {
	schedule: {hour: 9, minute: 0},
	async job(){
		if(!this.guilds.has(ids.homeSrv)) return log.error('SB doesn\'t have access to homeSrv, can\'t reqBoard');
		const guild = this.guilds.get(ids.homeSrv);
		
		//const member = guild.members.filter(member=>member.roles.has(ids.tre)).random();	//Pick a random TRE
		const member = guild.members.get(ind.lucy);
		const owner = guild.members.get(ids.owner);
		
		const messages = [
			`Good morning ${member.displayName}! May the shinies be with you!`,
			`Morning ${member.displayName}! Hope you had a good sleep because now its **raiding time**!`,
			`Gooood morning ${member.displayName}! Hope you weren't looking for an amusing message because I'm fresh out of ideas...`,
			`Its that time again ${member.displayName}! Here again to remind you that whilst yes, people do suck, you do not.`,
			`Motivation. Love. Awesomeness. That is all.`,
			`I can't think of anything so maybe you should just Google 'eyebleach'. Trust me, it will be good.`,
			`This just in, shiny bow-tie Pikachu has been released! /jk`,
			`A wild bot appeared! Morning :)`,
			`Poke-puns are the *absol*ute worst, right!`,
			`Pun-o'clock you say? *Wynaut*!`,
			`What! We're out of puns!? That's *onix*ceptable!`
		];
		const msg = messages[Math.floor(Math.random()*messages.length)];
		member.send(msg);
		owner.send(msg);
		log.debug(`${member.displayName} poked.`);
	}
};
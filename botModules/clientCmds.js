const Discord = require('discord.js');
const fs = require('fs');
const sched = require('node-schedule');
const {log} = require('./logger.js');
const moment = require('moment');

function loadCommands(){
	log.debug('Loading commands...')
	const newCommands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./botModules/commands').filter(file => file.endsWith('.js'));
	for(const fileName of commandFiles){
		delete require.cache[require.resolve(`./commands/${fileName}`)];
		const file = require(`./commands/${fileName}`);
		newCommands.set(file.name, file);
		log.debug(`\t${fileName} loaded`);
	};
	this.commands = newCommands;
	log.info(`${this.commands.size} commands loaded:\n`+this.commands.map((command, name)=>` - ${name}`).join('\n'));
};

function loadHandlers(){
	log.debug('Loading handlers...');
	const newHandlers = new Discord.Collection();
	const handlerFiles = fs.readdirSync('./botModules/handlers').filter(file => file.endsWith('.js'));
	for(const fileName of handlerFiles){
		delete require.cache[require.resolve(`./handlers/${fileName}`)];
		const file = require(`./handlers/${fileName}`);
		newHandlers.set(fileName, file);
	};
	this.handlers = newHandlers;
	this.removeAllListeners();
	this.handlers.forEach((file, fileName)=>{
		this.on(file.on, file.execute);
		log.debug(`\t${fileName} loaded`);
	});
	log.info(`${this.handlers.size} handlers loaded:\n`+this.handlers.map((handler, name)=>` - ${name}`).join('\n'));
};

function loadJobs(){
	this.cancelJobs();
	log.debug('Loading jobs...');
	this.jobs = new Discord.Collection();
	const jobFiles = fs.readdirSync('./botModules/jobs').filter(file => file.endsWith('.js'));
	for(const fileName of jobFiles){
		delete require.cache[require.resolve(`./jobs/${fileName}`)];
		const file = require(`./jobs/${fileName}`);
		const job = sched.scheduleJob(file.schedule, file.job.bind(this));
		job.on('scheduled', function(name, time){log.info(`JOB: ${name} running. Next run @ ${moment(time).toISOString(true)}`)}.bind(null, fileName));
		job.on('canceled', function(name, time){log.debug(`\t${name} canceled.`)}.bind(null, fileName));
		this.jobs.set(fileName, job);
		log.debug(`\t${fileName} scheduled for ${moment(job.nextInvocation()).toISOString(true)}`);
	};
	log.info(`${this.jobs.size} jobs loaded:\n`+this.jobs.map((job, name)=>` - ${name} sched for ${moment(job.nextInvocation()).toISOString(true)}`).join('\n'));
};

function cancelJobs(){
	if(!this.jobs) return;
	log.debug('Cancelling jobs...');
	this.jobs.forEach(job=>{
		job.cancel();
	});
	log.debug(`${this.jobs.size} jobs cancelled`);
	delete this.jobs;
};
module.exports = {
	loadCommands,
	loadHandlers,
	loadJobs,
	cancelJobs
};
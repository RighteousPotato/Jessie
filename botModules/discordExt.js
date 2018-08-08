const Discord = require('discord.js');
const fs = require('fs');
const sched = require('node-schedule');
const {log} = require('./logger.js');

/**************************************************
##	RichEmbedExt
##	An extension of Discord.js's RichEmbed class
##	Identical except the constructor can take
##	a MessageEmbed object.
**************************************************/

class RichEmbedExt extends Discord.RichEmbed{
	constructor(data){
		if(data instanceof Discord.MessageEmbed){
			log.warn('Using constructor');
			super();
			if(data.author) this.setAuthor(data.author.name, data.author.iconURL, data.author.url);
			this.setColor(data.color);
			if(data.description) this.setDescription(data.description);
			if(data.fields.length>0){
				this.fields = data.fields.map(field=>{
					return{name: field.name, value: field.value, inline: field.inline}
				});
			};
			if(data.footer) this.setFooter(data.footer.text, data.footer.iconURL);
			if(data.image) this.setImage(data.image.url);
			if(data.thumbnail) this.setThumbnail(data.thumbnail.url);
			this.setTimestamp(data.timestamp);
			if(data.title) this.setTitle(data.title);
			this.setURL(data.url);
		}else{
			super(data);
		};
	};
};

/**************************************************
##	toRichEmbed
##	Extra function for Discord.js's MessageEmbeds
##	Works with RichEmbedExt to convert a ME to a RE
**************************************************/

function toRichEmbed(){
	log.warn('Using toRichEmbed');
	return new Discord.RichEmbed(this);
	/* const rEmbed = new Discord.RichEmbed();
	if(this.author) rEmbed.setAuthor(this.author.name, this.author.iconURL, this.author.url);
	rEmbed.setColor(this.color);
	if(this.description) rEmbed.setDescription(this.description);
	if(this.fields.length>0){
		rEmbed.fields = this.fields.map(field=>{
			return{name: field.name, value: field.value, inline: field.inline}
		});
	};
	if(this.footer) rEmbed.setFooter(this.footer.text, this.footer.iconURL);
	if(this.image) rEmbed.setImage(this.image.url);
	if(this.thumbnail) rEmbed.setThumbnail(this.thumbnail.url);
	rEmbed.setTimestamp(this.timestamp);
	if(this.title) rEmbed.setTitle(this.title);
	rEmbed.setURL(this.url);
	return rEmbed; */
};

/**************************************************
##	SendExt
##	An extension of Discord.js's channel.send()
##	Identical except will properly convert
##	MessageEmbeds to RichEmbeds
**************************************************/

function sendExt(content, options){
	if(!options && content instanceof Discord.MessageEmbed){
		options = {embed: new Discord.RichEmbed(content)};
		content = '';
		log.warn('Trying to send a messageEmbed 1');
	};
	if(options instanceof Discord.MessageEmbed){
		options = {embed: new Discord.RichEmbed(options)};
		log.warn('Trying to send a messageEmbed 2');
	};
	if(options && options.embed instanceof Discord.MessageEmbed){
		options.embed = new Discord.RichEmbed(options.embed);
		log.warn('Trying to send a messageEmbed 3');
	};
	return this._send(content, options);
};

const colors = {
	YELLOW: 0xF1C40F
};

//EXTEND DISCORD.JS
Discord.RichEmbed = RichEmbedExt;		//Modify the RichEmbed constructor to allow passing a MessageEmbed
if(!Discord.MessageEmbed.prototype.toRichEmbed){	//Convenience function for new RichEmbed(MessageEmbed)
	Discord.MessageEmbed.prototype.toRichEmbed = toRichEmbed;
};
if(!Discord.TextChannel.prototype._send){			//Modify channel.send to allow sending a MessageEmbed
	Discord.TextChannel.prototype._send = Discord.TextChannel.prototype.send;
	Discord.TextChannel.prototype.send = sendExt;
};
Discord.Constants.Colors = Object.assign(Discord.Constants.Colors, colors);

module.exports = {
	RichEmbedExt,
	toRichEmbed,
	sendExt,
	colors
};
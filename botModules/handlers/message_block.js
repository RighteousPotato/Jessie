module.exports = {
	on: 'message_block',
	async execute(message, response){
		const reply = await message.reply(response);
		if(message.deletable) message.delete(15000);
		reply.delete(16000);
	}
};
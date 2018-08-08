module.exports = {
	on: 'message_block',
	async execute(message, response){
		const reply = await message.reply(response);
		message.delete(10000);
		reply.delete(10000);
	}
};
module.exports = {
    name: 'ping',
    description: 'Ping!',
	testString: 'String',
	testNo: 666,
	testT: true,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};
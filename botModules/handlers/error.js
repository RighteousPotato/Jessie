//DEPENDENCIES
const {libLog} = require('../logger.js');

module.exports = {
	on: 'error',
	execute(e) {
		let msg='';
		if(e.type) msg+=`Type: ${e.type}\n`;
		if(e.message) msg+=`Msg: ${e.message}\n`;
		if(e.error) msg+=`Err: ${e.error}\n`;
		const extraKeys = Object.keys(e).filter(key=>!['type', 'message', 'error'].includes(key));
		if(extraKeys.length>0) msg+=`Unlogged keys: ${extraKeys.join(', ')}\n`;
		if(e.stack) msg+=`Stack:\n${e.stack}`;
		libLog.error(msg);
	}
};
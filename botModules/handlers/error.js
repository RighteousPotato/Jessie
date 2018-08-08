//DEPENDENCIES
const {libLog} = require('../logger.js');

module.exports = {
	on: 'error',
	execute(e) {
		if(e.type) libLog.error(e.type);
		if(e.message) libLog.error(e.message);
		if(e.error) libLog.error(e.error);
		const extraKeys = Object.keys(e).filter(key=>!['type', 'message', 'error'].includes(key));
		if(extraKeys.length>0) libLog.error(`Unlogged keys: ${extraKeys.join(', ')}`);
	}
};
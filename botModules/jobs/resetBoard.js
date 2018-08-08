const sb = require('../sb.js');

module.exports = {
	schedule: {date: 1, hour: 0, minute: 5, second: 0},
	job(){
		sb.resetBoard();
	}
};
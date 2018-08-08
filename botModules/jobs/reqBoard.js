const sb = require('../sb.js');

module.exports = {
	schedule: {minute: 0},
	job(){
		sb.reqBoard();
	}
};
var BotSailBase = require(global.appRoot + "/core/botsailbase.js");
var Common = require(global.appRoot + "/core/common.js");


class Engine extends BotSailBase {
	constructor() {
		super();
		this.chatInfo = null;

	}

	


	//Create output data
	async out(answer, chatInfo) {
		let theAnswer = [];
		let obj = null;
		for(let i = 0; i < answer.length; i++) {
			

			
		}

		return theAnswer;
		
	}

	//return image path
	getImagePath(srctext) {
		srctext = srctext.replace(/\s/g, "");
		var re = /(.*{{img.)(.*)(}}.*)/;
		var newtext = srctext.replace(re, "$2");

		if(newtext.length < srctext.length) return newtext;

		return null;
	}
	
	//return random answer
	getRandomAnswer(answer) {
		R = Common.randomNum(0, answer.length - 1);
		return answer[R];
	}

	
}

module.exports = Engine;
var Common 			= 	require(global.appRoot + "/core/common.js");
var BotSailBase = require(global.appRoot + "/core/botsailbase");

class PackageProcess extends BotSailBase {
	static async getDashboarData() {
		let obj = {};
		obj['topicCnt'] = 1;//await Topic.count();
		obj['pluginCnt'] = 1;//await Plugin.count();
		obj['contentCnt'] = await Content.count();
		obj['templateCnt'] = 1;//await Template.count();

		return obj;
	};

}

module.exports = PackageProcess;
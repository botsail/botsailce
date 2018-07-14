//var CacheData            = require(global.appRoot + "/app/models/entities/cache"); 

var mongoose = require('mongoose');

var elementCacheSchema = mongoose.Schema(
    {
        key:String,
        value:Object,
        last_access: Number,
    }
);

var cacheSchama = mongoose.Schema({    
    name:{type:String, default:'cache'},
    data:[{
        key:String,
        value:Object,
        last_access: Number,
    }],
    system : {type: String, default: 'core'},
    content:{type:String, default: 'cache for system'}
});


const CacheData = mongoose.model('cache', cacheSchama, 'metadatas');


class Cache {
    static async getValue(key) {
		let data = await CacheData.findOne({ name : 'cache', "data.key" : key },{'data.$': 1});
		if((data != undefined) || (data != null)) {
			await CacheData.update({name : 'cache', "data.key" : key},{"data.$.last_access" : Date.now()}
			);
		} else {
			return null;
		}
		
		return data.data[0].value;
	}

	static async setKey(key, value)  {
		//Check key exits
		let data = await CacheData.findOne({ name : 'cache', "data.key" : key },{'data.$': 1});
		if((data != undefined) || (data != null)) {
			await CacheData.update({name : 'cache', "data.key" : key},{ "data.$.value" : value ,"data.$.last_access" : Date.now()}		//update last access
			);
		} else {	//If key not exits, insert
			
			data = await CacheData.update(
			  {name : 'cache'  },
			  {$push: { "data" : { "key" : key,"value" : value , "last_access" : Date.now()}}},
			);
		}


		return data;
	}
};

module.exports = Cache;
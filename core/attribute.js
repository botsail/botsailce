// Nospk tran 
// Class attributes bot 
const botconfig = require(global.appRoot+ '/app/models/entities/bot');
const userAttribute = require(global.appRoot+ '/app/models/entities/userattribute');

// bot = _id when bot active will configs
// option = client_system
class Attributes {
    createUserAttribute(bot, attribute_name){
        // function create name in botconfig.user_attribute 
         function Create_User_list(bot, attribute_name,att_id){
            return new Promise((resolve, reject)=>{
                let data = ({
                    name:attribute_name,
                    att_id:att_id
                })
                botconfig.findOneAndUpdate(
                    {_id:bot},
                    {$push:{user_attribute:data}}//$addToSet use for array if object use $push
                ,function(err){
                    if(err){
                        reject(err.message);// if err
                    }else{
                        resolve('Data saved!');// return
                    }
                })
            })
        }
        // function create data basic in user_attribute 
        function createUserData(bot, attribute_name){
            return new Promise((resolve, reject)=>{
                let data = new userAttribute({ // schema data basic
                    name: 'user_attribute',
                    bot_id: bot,
                    attribute_name: attribute_name,
                    data:[]
                    });
                data.save()//save data
                .then((data)=>{
                    resolve(data.id);//return 
                })
                .catch(err=>{
                    reject(err.message);//if err
                })
            })          
        }
        // check name attribute is have ?
        function Check(bot, attribute_name){
            return new Promise((resolve, reject)=>{
                botconfig.findOne({_id:bot, 'user_attribute.name':attribute_name})
                .then(data=>{
                    if(data){
                        reject('Same name attribute');
                    }else{
                        resolve();
                    }
                })
            })
        }
        // main funtion
        return new Promise((resolve, reject)=>{
            Check(bot, attribute_name)
            .then(()=>{ return createUserData(bot, attribute_name)}) // return function to get chain value att_id      
            .then((att_id)=>{
                Create_User_list(bot, attribute_name,att_id);            
            })        
            .then(()=>{
                resolve();// return
            })
            .catch(err=>{       
                reject(err.message); // if err
            })
        })
    }
    // add new user attributes
    addUserAttributes(bot, attribute_name, uid, value){
        function Check(bot, attribute_name){
            return new Promise((resolve, reject)=>{
                botconfig.findOne({_id:bot, 'user_attribute.name':attribute_name})
                .then(data=>{
                    if(data){
                        resolve();
                    }else{
                        reject('Not have attribute name');
                    }
                })
            })
        }
        return new Promise((resolve, reject)=>{
            Check(bot, attribute_name)
            .then(()=>{
                const data = ({// schema data user
                    uid: uid,
                    value : value,    
                });
                userAttribute.findOneAndUpdate({bot_id:bot,attribute_name:attribute_name },{$push:{data:data}})//save
                .then(()=>{
                    resolve();// return
                })
                .catch(err=>{
                    reject(err.message);//if err
                })
            })
            .catch(err=>{
                reject(err.message);//if err
            })
        })
    }
    // get information and promise return value
    getUserAttributes(bot, attribute_name, uid){
        return new Promise((resolve, reject)=>{
            userAttribute.find({
                bot_id:bot,
                attribute_name:attribute_name,
                data:{$elemMatch:{uid:uid}}, 
            },{'data.$':1})
            .then(data=>{
                if(data!=""){

                    resolve(JSON.stringify(data));
                }else{
                    reject('Not found');
                }           
            })
            .catch(err=>{
                reject(err.message);
            })
        })
    }
    // delete user attribute
    delUserAttributes(bot,attribute_name,uid){
        return new Promise((resolve, reject)=>{
            userAttribute.findOneAndUpdate(
                {bot_id:bot,attribute_name:attribute_name},
                {$pull: {data:{uid:uid}}})
                .then(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err.message);
                })
        })
    }
    // update value in user attribute
    updateUserValueAttributes(bot,attribute_name,uid, value){
        return new Promise((resolve, reject)=>{
            userAttribute.findOneAndUpdate(
                {bot_id:bot,attribute_name:attribute_name,data:{$elemMatch:{uid:uid}}},
                {$set: {'data.$.value':value}})//set value new
                .then(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err.message);
                })
        })
    }
	//ok 6
    // update attribute_name in bot configs
    updateUserAttributesName(bot,old_name, new_name){
        function Check(bot, new_name){// check same name
            return new Promise((resolve, reject)=>{
                botconfig.findOne({_id:bot, 'user_attribute.name':new_name})
                .then(data=>{
                    if(data){

                        reject('Same name attribute');
                    }else{
                        resolve();
                    }
                })
            })
        }
        function update_name_bot(bot,old_name, new_name){
            return new Promise((resolve, reject)=>{
                botconfig.findOneAndUpdate(
                    {_id:bot,'user_attribute.name':old_name},
                    {$set: {'user_attribute.$.name': new_name }})
                .then(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err.message);
                })
            })
        }
        function update_name_user(bot,old_name, new_name){
            return new Promise((resolve, reject)=>{
                userAttribute.findOneAndUpdate(
                    {bot_id:bot,attribute_name:old_name},
                    {$set:  {attribute_name: new_name}}
                )
                .then(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err.message);
                })

            })
        }
        return new Promise((resolve, reject)=>{
            Check(bot, new_name)
            .then(()=>{return Promise.all([update_name_user(bot,old_name, new_name),update_name_bot(bot,old_name, new_name)])}) // if finnish all ) 
            .then(()=>{

                resolve('Data saved!');//return
            })
            .catch(err=>{
                reject(err.message); // if err
            })
        })
    }
	//ok 7
	// delete in user_attribute	and botconfig
    delUserAttributesRoot(bot,attribute_name){
        return new Promise((resolve, reject)=>{
            botconfig.findOne({'_id':bot,'user_attribute.name':attribute_name},{'user_attribute.$':1})
			.then(data=>{
				if(data!=null){// if find correct attribute_name
					const id = (data.user_attribute[0].att_id);// get id attribute link form bot config
					Promise.all([
						userAttribute.findOneAndRemove({_id:id}),// remove userAttribute first
						botconfig.findOneAndUpdate({_id:bot},{$pull: {user_attribute: {name: attribute_name}}})// remove data in bot config
					])
					.then(()=>{
						resolve('Done delete user attribute!');
					})
					.catch(err=>{
						reject(err);
					})
				}else{
					reject('Not trust data');
				}
				
			})
			.catch(err=>{
                reject(err.message); // if err
            })
			
			
			

        })
    }
    // ok 8
    // add bot attribute
    addBotAttributes(bot,name, value){
        function Check(bot, name){
            return new Promise((resolve, reject)=>{
                botconfig.findOne({_id:bot, 'bot_attribute.name':name})
                .then(data=>{
                    if(data){
                        reject('Same name attribute');
                    }else{
                        resolve();
                    }
                })
            })
        }
        return new Promise((resolve, reject)=>{
            Check(bot, name)    
            .then(()=>{
                const data = ({
                    name:name,
                    value:value         
                });
                return botconfig.findOneAndUpdate({_id:bot},{$push:{bot_attribute:data}})
            })
            .then(()=>{
                resolve('Save bot attribute!');
            })
            .catch(err=>{
                reject(err.message);
            })
        })
    }
    //ok 9
    // get information bot attribute
    getBotAttributes(bot,name){
        return new Promise((resolve, reject)=>{
            botconfig.find({
                '_id':bot,
                bot_attribute:{$elemMatch:{name:name}}, 
            },{'bot_attribute.$':1})
            .then(data=>{
                if(data!=""){
                    resolve(JSON.stringify(data));
                }else{
                    reject('Not found');
                }
                 
            })
            .catch(err=>{
                reject(err.message);
            }) 
        })
    }
    //ok 10
    // remove bot attribute by name 
    delBotAttributes(bot,name){
        return new Promise((resolve, reject)=>{
            botconfig.findOneAndUpdate(
                {_id:bot},
                {$pull: {bot_attribute:{name:name}}})
                .then(()=>{
                    resolve();
                })
                .catch(err=>{
                    reject(err.message);
                })
        })
    }
    //ok 11
    // update value bot attribute
    updateBotvalueAttributes(bot,name, value){
        return new Promise((resolve, reject)=>{
            botconfig.findOneAndUpdate(
                {_id:bot,'bot_attribute.name':name},
                {$set: {'bot_attribute.$.value':value}})//set  new value
                .then(()=>{
                    resolve('Save done bot!');
                })
                .catch(err=>{
                    reject(err.message);
                })
        })
    }
    //ok 12
    // update new name bot attribute
    updateBotnameAttributes(bot,old_name, new_name){
        function Check(bot, name){
            return new Promise((resolve, reject)=>{
                botconfig.findOne({_id:bot, 'bot_attribute.name':name})
                .then(data=>{
                    if(data){
                        reject('Same name attribute');
                    }else{
                        resolve();
                    }
                })
            })
        }
        return new Promise((resolve, reject)=>{
            Check(bot, new_name)
            .then(()=>{
                return botconfig.findOneAndUpdate({_id:bot,'bot_attribute.name':old_name},{$set: {'bot_attribute.$.name':new_name}})//set new name
            })
            .then(()=>{
                resolve('Save done bot!');
            })
            .catch(err=>{
                reject(err.message);
            })
        })
    }
	//ok 12
	// find name all user and bot
	getNameAttributes(bot){
		return new Promise((resolve, reject)=>{
			let dataJson = ({
				user: [],
				bot : [],
			});
			botconfig.findById({_id:bot},'user_attribute.name bot_attribute.name bot_attribute.value')
			.then(data=>{
				if(data != null) {
					data.user_attribute.forEach(element=>{dataJson.user.push(element)});
					data.bot_attribute.forEach(element=>{dataJson.bot.push(element)});				
				}
				
			})
			.then(()=>{
				resolve(dataJson);
			})
			.catch(err=>{
				reject(err.message);
			})
		})
	}


}
module.exports = Attributes;
function editBlock(id) {
	location.href = "/show_block?id=" + id;
}

function setMethod(index, method) {
	let label = "GET";
	if(method == 2) label = "POST";
	
	$("#method_" + index).text(label);
}

function getButtonValue(index) {
	let max_index  = $("#max_index_" + index).val();
	let buttonArr = [];
	for(i = 0;i < max_index;i++) {
		let title = $("#title_" + i + "_" + index).val();
		if(title != undefined) {
			let obj = {
				title: title,
                type: "url",
                "url": $("#url_" + i + "_" + index).val(),
                title_id: "#title_" + i + "_" + index,
                url_name: "#url_" + i + "_" + index
			};
			
			buttonArr.push(obj);
		} else {
			let obj = {
                type: "block",
                block_id: $("#block_" + i + "_" + index).val(),
                id_name: "#block_" + i + "_" + index
			};
			
			buttonArr.push(obj);
		}
	}
	
	return buttonArr;
}

function getTextValue(index) {
	let content = $("#text_" + index).val(); 
	let objButton = getButtonValue(index);
	let obj = {
		type: "text",
		content : content,
		button:objButton,
		id_name : "text_" + index
	};
	
	return obj;
	
}

function getImageValue(index) {
	let image_path = $("#image_" + index).val(); 
	let image_title = $("#image_title_" + index).val(); 
	let image_subtitle = $("#image_subtitle_" + index).val(); 
	let group_id = $("#image_groupid_" + index).val(); 
	
	let objButton = getButtonValue(index);
	let obj = {
		type : "image",
		image_path : image_path,
		title : image_title,
		sub_title : image_subtitle,
		group_id : group_id,
		button:objButton,
		image_title_id : "image_title_" + index
	};
	
	return obj;
	
}


function getRequestValue(index) {
	let action = $("#method_" + index).text();
	let url = $("#url_" + index).val();
	let parameter = $('#parameter_' + index).val() + "";
	let receive = $('#receive_' + index).val() + "";
	let obj = {
		type: "request",
		action: action,
		url: url,
		parameter : parameter,
		receive:receive,
		id_name : 'method_' + index
	};
	
	return obj;
	
}

function getJSScriptValue(index) {
	let jsscript = $("#jsscript_" + index).val();
	
	let obj = {
		type: "jsscript",
		jsscript: jsscript,
		id_name : "jsscript_" + index
	};
	
	return obj;
	
}

function sendData() {
	let value = [];
	let type = "";
	let obj = null;
	for(let i = 0; i < bindex;i++) {
		type = $("#type_" + i).val();
		obj = null;
		if(type == "text") obj = getTextValue(i);
		if(type == "image") obj = getImageValue(i);
		if(type == "request") obj = getRequestValue(i);
		if(type == "jsscript") obj = getJSScriptValue(i);
		
		if(obj != null) value.push(obj);
		
	}
	
	let name = $("#block_name").val();
	let id = $("#id").val();

	let data = {
		id: id,
		name: name,
		value: value
	};
	
	
	$.ajax( {
	      	type: "POST",
			url: "/save_block",	
			dataType: "json",			
			data: data,	

			success: function(data) {
				if((data.error != undefined ) && ((data.error != null) && (data.error.length > 0))){
					showErrorMessage(data.error);
					swal({
						title: 'error',
						type: "error",
						text: "Something wrong, please check input!",
						showConfirmButton: false
					});
				}else{
					reset();
				}
			}
	});
}

function reset(){
	location.href = "/show_block";
}
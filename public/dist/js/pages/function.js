function editFunction(id) {
	location.href = "/show_fnc?id=" + id + "&type=" + $('#type_name').val();
}

function sendData() {
	
	let name = $("#fnc_name").val();
	let type_name = $("#type_name").val();
	let script = $("#script").val();
	let id = $("#id").val();

	let data = {
		id: id,
		name: name,
		script: script,
		type_name: type_name
	};
	
	
	$.ajax( {
	      	type: "POST",
			url: "/save_fnc",	
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
	location.href = "/show_fnc?type=" + $('#type_name').val();
}
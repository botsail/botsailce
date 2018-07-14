//when off random button, alert and delete records
function onOffRandom(obj) { 

	if(obj.checked == false){ 
		
		$('#user_say_tagsinput').show();
		$('#user_say').hide();
		$('#pattern').val('no');
	}else{
		$('#user_say_tagsinput').hide();
		$('#user_say').show();
		$('#pattern').val('yes');
	}

}

//load content on the form
function editContent(id) {
	location.href = "/content/edit?id=" + id
}


// Delete perline when click trash
function Delete(e){
	$(e).closest('.input-group').next('br').remove();
	$(e).closest('.input-group').remove();
}

//this function helps us show the records from database
function showData(){
	var id;
	
	//call ajax to send the topic. Server processes and return the records which have corresponding topic
	$.ajax({
	    	type: "POST",
	    	url: "/content/show",
	    	data: {topic: "reminder"},
	    	success: function(json){
				data = json.data;
	    		var table = document.getElementById('table');
	    		var str = "<tr>" + 
			                  "<th>STT </th>" + 
			                 " <th>User Say</th>" +
			                  "<th>Type </th>" + 
			                  "<th> </th>" +
			                  "<th> </th>" +
			                "</tr>" ;
			    for (var i = 0; i < data.length; i++) {
					id = data[i]._id+ "";
					let type = 'Normal';
					if(data[i].pattern == 'yes') type = 'Regular';
				    str += "<tr>" + 
			                  "<td>"+(i+1)+"</td>"+
			                  "<td>"+ data[i].user_say +"</td>" + 
			                  "<td>"+ type +"</td>" + 
			                  "<td>"  +
			                    "<a title='Click here to edit' href='#' onClick='editContent(\""+id+"\")'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit</a>" + 
			                  "</td>" +
			                 " <td>" +
			                    "<a title='Click here to delete' href='#' onClick='confirmDeleteContent(\""+id+"\")' style='color: #dd4b39;' ><i class='fa fa-times-circle' aria-hidden='true'></i> Delete</a>"+
			                 " </td>"+
			                "</tr>" ;
		        }
				table.innerHTML = str;
				return;
	    	}
		});
}

//confirm
function confirmDeleteContent(id){
	swal({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			  if(result){
			  		deleteContent(id);
			  }
		});
}

//send request to server and delete corresponding record
function deleteContent(id){
	$.ajax({
			type: "POST",
	  		url: "/content/delete",
	  		data: {id: id},
			success: function(json){
				data = json.message;
			  	if(data == "success"){
			  		swal({
			  			title: "Delete Successfully!",
						text: "This record has been deleted",
	  					type: data,
	  					showConfirmButton: true,
			  			timer: 1000
			  		});
			  		showData();
			  	}else{
			  		swal({
			  			title: "error",
			  			type: data,
			  			showConfirmButton: false,
			  			timer: 1000
			  		});
			  	}
			}
  	});
}

function getTextValue(index) {
	let content = $("#text_" + index).val(); 
	let obj = {
		type: "text",
		content : content,
		id_name : "text_" + index
	};
	
	return obj;
	
}

function getImageValue(index) {
	let image_path = $("#image_" + index).val(); 
	let obj = {
		type : "image",
		image_path : image_path,
		image_title_id : "image_title_" + index
	};
	
	return obj;
	
}

function getBlockValue(index) {
	let obj = {
		type: "block",
		block_id: $("#block_"  + index).val(),
		id_name: "#block_" + index
	};
	
	return obj;
	
}
function sendData(){
	let value = [];
	let type = "";
	let obj = null;
	
	for(let i = 0; i < index;i++) {
		type = $("#type_" + i).val();
		obj = null;
		if(type == "text") obj = getTextValue(i);
		if(type == "image") obj = getImageValue(i);
		if(type == "block") obj = getBlockValue(i);
		
		if(obj != null) value.push(obj);
	}
	
	var content = {
		user_say: $('#user_say').val(),
		pattern: $('#pattern').val(),
		answer: value,
		id: $("#id").val()
	};
	
	$.ajax( {
	      	type: "POST",
			url: "/content/save",			
			data: JSON.stringify(content),	
			dataType: 'json',
            contentType: 'application/json',

			success: function(data) {

				if((data.error != undefined ) && ((data.error != null) && (data.error.length > 0))){
					showErrorMessage(data.error);
					swal({
						title: 'error',
						type: "error",
						text: "Something wrong, please check input!",
						showConfirmButton: false,	
						timer: 2000
					});
				}else{
					swal({
						title: 'Successfully',
						text: "Data saved!",
						type: "success",
						showConfirmButton: true,	
						timer: 3000
					}).then((result)=>{										
					});
					// refresh data
					reset();
				}
			
	    	}	   
		});
	
}

//this function bellow is used to send data to server and save it
function sendData1(){

		var template =[];
		var filepath = [];
		var answer = document.getElementsByClassName("form-control botanswer");
		var user_say = document.getElementById('user_say');

		var formselect = $('select.form-control.select2 :selected').each(function(){
			template.push($(this).val());
		});

		var inputfile = $(".hiddenFile").each(function(){
			filepath.push($(this).val());
		});
		
		var id = $("#id").val();
		var day = new Date();
		
		console.log(filepath);
		//create object content combining the information
		var content = {
					topic: "reminder",
					user_say: user_say.value,
					pattern: $('#pattern').val(),
					answer: [],
					lang: "vi",
					updatetime: day.getTime(),
					template: template,
					filepath: filepath,
					id: id
				};

		let j = 0;
		for(var i = 0; i < answer.length; i++){
			if(answer[i].value.length > 0) {
				content.answer[j] = answer[i].value;
				j++;
			} else {
				content.answer[j] = '';
				j++;
			}
	
		}
		//alert(content);

		var data = new FormData($('#form_answers')[0]);	
		data.append('content', JSON.stringify(content));

		//cal ajax
		$.ajax( {
	      	type: "POST",
			
			url: "/content/save",			
			data: content,	

			success: function(data) {

				if((data.error != undefined ) && ((data.error != null) && (data.error.length > 0))){
					showErrorMessage(data.error);
					swal({
						title: 'error',
						type: "error",
						text: "Something wrong, please check input!",
						showConfirmButton: false,	
						timer: 2000
					});
				}else{
					swal({
						title: 'Successfully',
						text: "Data saved!",
						type: "success",
						showConfirmButton: true,	
						timer: 3000
					}).then((result)=>{										
					});
					// refresh data
					reset();
				}
			
	    	}	   
		});
}


// this function resets form. reset the item in localStorage and redirect to "/"
function reset(){
	location.href = "/content/show";
}


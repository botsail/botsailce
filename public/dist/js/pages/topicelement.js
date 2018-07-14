//load content on the form
function editContent(tid,id) {
	location.href = "/bs-admin/topicelement/edit?tid=" + tid + "&id=" + id
}

// Delete perline when click trash
function Delete(e){
	$(e).closest('.input-group').next('br').remove();
	$(e).closest('.input-group').remove();
}

//this function helps us show the records from database
function showData(){
	var topic_id = $('#tid').val();
	
	//call ajax to send the topic. Server processes and return the records which have corresponding topic
	$.ajax({
	    	type: "POST",
	    	url: "/bs-admin/topicelement/show",
	    	data: {tid: topic_id},
	    	success: function(json){
				data = json.data;
	    		var table = document.getElementById('table');
	    		var str = "<tr>" + 
			                  "<th>STT </th>" + 
			                 " <th>user_say</th>" +
			                  "<th>answer </th>" + 
			                  "<th> </th>" +
			                  "<th> </th>" +
			                "</tr>" ;
			    for (var i = 0; i < data.length; i++) {
					id = data[i]._id+ "";
					tid = data[i].topic_id + "";
					if(data[i].answer.length == 1){
						data[i].answer = 'Simple';
					}else{
						data[i].answer = 'Multi-Option';
					}
				    str += "<tr>" + 
			                  "<td>"+(i+1)+"</td>"+
			                  "<td>"+ data[i].user_say +"</td>" + 
			                  "<td>"+ data[i].answer +"</td>" + 
			                  "<td>"  +
			                    "<a title='Click here to edit' href='#' onClick='editContent(\""+tid+"\",\""+id+"\")'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit</a>" + 
			                  "</td>" +
			                 " <td>" +
			                    "<a title='Click here to delete' href='#' onClick='confirmDeleteContent(\""+tid+"\",\""+id+"\")' style='color: #dd4b39;' ><i class='fa fa-times-circle' aria-hidden='true'></i> Delete</a>"+
			                 " </td>"+
			                "</tr>" ;
		        }
				table.innerHTML = str;
				return;
	    	}
		});
}

//confirm
function confirmDeleteContent(tid,id){
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
			  		deleteContent(tid,id);
			  }
		});
}

//send request to server and delete corresponding record
function deleteContent(tid,id){
	$.ajax({
			type: "POST",
	  		url: "/bs-admin/topicelement/delete",
	  		data: {tid: tid, id: id},
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
			  		reset();
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

//this function bellow is used to send data to server and save it
function sendData(){

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
		var tid = $("#tid").val();
		var day = new Date();
		
		console.log(filepath);
		//create object content combining the information
		var content = {
					topic: "reminder",
					user_say: user_say.value,
					answer: [],
					callback: $('#callback').val(),
					updatetime: day.getTime(),
					template: template,
					filepath: filepath,
					id: id,
					tid: tid
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
			enctype: "multipart/form-data",
			processData: false,  // Important!
			contentType: false,
			cache: false,
			url: "/bs-admin/topicelement/save",			
			//url: "/bs-admin/save-template",			
			data: data,	

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
	var tid = $("#tid").val();
	location.href = "/bs-admin/topicelement/show?tid=" + tid;
}



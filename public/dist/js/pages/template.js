function addNewButton() {
	str = 	'<div class="btnGroup">' + 
				'<div class="row">' + 
					'<div class="col-lg-6">' + 
						'<div class="form-group">' + 
						  '<label>Button label</label>' + 
						  '<input type="text" class="form-control" name="button_label[]" id="button_label[]" placeholder="Button lable">' + 
						'</div>' + 
					'</div>' + 
					'<div class="col-lg-6">' + 
						'<div class="form-group">' + 
						  '<label>Button URL</label>' + 
						  '<input type="text" class="form-control" name="button_url[]" id="button_url[]" placeholder="Button URL">' + 
						'</div>' + 
					'</div>' + 
				'</div>' + 
			'</div>';
    $("#template_panel").append(str);
}

function editContent(id) {
	//call ajax to send is
	$.ajax({
		url: "/bs-admin/edit-template",
		type: "GET",		
		data: {_id: id},
		success: function(found){
			$('#_id').val(found._id);
			$('#template_name').val(found.name);	
			$('#title').val(found.title);	
			$('#subtitle').val(found.subtitle);

			for(var i = 0; i < $(".btnGroup").length; i++){
				$(".btnGroup").html('');
			}	
			var len;
			if(found.button_label.length > found.button_url.length){
				len = found.button_label.length;
			}else{
				len = found.button_url.length;
			}
			for(var i = 0; i < len; i++){
				var str = "";
				str = str + '<div class="btnGroup">' +
								'<div class="row">' +
									'<div class="col-lg-6">' +
										'<div class="form-group">' + 
										  '<label>Button label</label>' +
										  '<input type="text" class="form-control" name="button_label[]" id="button_label[]" placeholder="Template name" value="' + found.button_label[i] + '">' +
										'</div>' +
									'</div>' + 
										'<div class="col-lg-6">' +
											'<div class="form-group">' +
												'<label>Button URL</label>' +
												'<input type="text" class="form-control" name="button_url[]" id="button_url[]" placeholder="Template name" value="' + found.button_url[i] + '">' +
											'</div>' +
										'</div>' +
								'</div>' + 
							'</div>';
				$("#template_panel").append(str);
			}			
		}
	});
}

function confirmDeleteContent(id) {
	swal({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			  $.ajax({
					url: "/bs-admin/delete-template",
					type: "DELETE",					
					data: {_id: id},
					success: function(data){
						if(data == "success"){
							swal({
								title: "Delete Successfully!",
								text: "This record has been deleted",
								type: data,
								showConfirmButton: true,
								timer: 1000
							});
							// refresh data
							getAllData();
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
		})
}

function validation() {
	var name = $('#template_name').val();	
	var title = $('#title').val();	
	var subtitle = $('#subtitle').val();
	var button_label = $('#button_label\\[\\]');	
	var button_url = $('#button_url\\[\\]');

	if(name.length == 0) {
		$('#error-template_name').val('Template name is require');
	}  
}


function saveData(){
	var day = new Date();
	var _id = $('#_id').val();	
	var template_name = $('#template_name').val();	
	var title = $('#title').val();	
	var subtitle = $('#subtitle').val();
	var button_label = $('#button_label\\[\\]');	
	var button_url = $('#button_url\\[\\]');			
	
	var template = new Object();   
	template._id = _id;
	template.template_name = template_name;
	template.title = title;
	template.subtitle = subtitle;	
	template.button_label = [];
	template.button_url = [];
	template.lang = 'vi';
	template.updatetime = day.getTime();			
	
	for(var i = 0; i < button_label.length; i++){				
		template.button_label[i] = $(button_label[i]).val();
	}
	
	for(var i = 0; i < button_url.length; i++){				
		template.button_url[i] = $(button_url[i]).val();
	}
	
	var data = new FormData($('#templateForm')[0]);	
	data.append('template', JSON.stringify(template));

	clearErrorMessage();
	$.ajax( {
		type: "POST",
		enctype: "multipart/form-data",
		processData: false,  // Important!
		contentType: false,
		cache: false,
		url: "/bs-admin/save-template",				
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
				getAllData();
				resetInput();
			}		
		}
	});
}

function resetInput(){
	$(':input','#templateForm').val('');	
	for(var i = 0; i < $(".btnGroup").length; i++){
		$(".btnGroup").html('');
	}	
	
	str = 	'<div class="btnGroup"> ' +
				'<div class="row"> ' +
					'<div class="col-lg-6">' +
						'<div class="form-group">' + 
						  '<label>Button label</label>' +
						  '<input type="text" class="form-control" name="button_label[]" id="button_label[]" placeholder="Button lable">' +
						'</div>' +
					'</div>' + 
					'<div class="col-lg-6">' +
						'<div class="form-group">' +
							'<label>Button URL</label>' +
							'<input type="text" class="form-control" name="button_url[]" id="button_url[]" placeholder="Button URL">' +
						'</div>' +
					'</div>' + 
				'</div>' +
			'</div>';
	$("#template_panel").append(str);
}

function getAllData(){	
	var content = new Object();   	
	$.ajax({
	    	type: "GET",
	    	url: "/bs-admin/template-list",
	    	data: content,
	    	success: function(data){
	    		var table = $('#tableContents').prop('outerHTML');	
								                
	    		var str = 	"<tr>" + 
								"<th>No</th>" + 
								"<th>Template name</th>" +
								"<th>Title</th>" +
								"<th>Image</th>" +
								"<th>Subtitle</th>" +								
								"<th>Button label</th>" +
								"<th>Button URL</th>" +
								"<th></th>" +
								"<th></th>" +
							"</tr>"
			    for (var i = 0; i < data.length; i++) {					
			    	id = data[i]._id + "";
				    str += "<tr>" + 
			                  "<td>" + (i+1) + "</td>" +
			                  "<td>" + data[i].name + "</td>" +
			                  "<td>" + data[i].title + "</td>" + 
			                  "<td><img src='" + data[i].image + "' class='template-img'></td>" +
							  "<td>" + data[i].subtitle + "</td>" +
							  "<td>" + data[i].button_label + "</td>" +
							  "<td>" + data[i].button_url + "</td>" +
			                  "<td>" +
			                    "<a href='#'  onClick='editContent(\""+id+"\")'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit</a>" + 
			                  "</td>" +
			                 " <td>" +
			                    "<a title='Nhấn vào đây để xóa' href='#' onClick='confirmDeleteContent(\""+id+"\")' style='color: #dd4b39;' ><i class='fa fa-times-circle' aria-hidden='true'></i> Delete</a>"+
			                 " </td>"+
			                "</tr>" ;
		        }
		        $('#tableContents').html(str);
	    	}
	    });
}

$( document ).ready(function() {
    getAllData();
});
$(() => {
	if($('#type').text() == ''){
		$('#type').text('In Topic');
	}

	$('#form_answers').on('submit', (e) => {
		e.preventDefault();
	})
})

//add a new box answwer
function addNewAnswerTextbox() {
	str = '<br> ' +
		     '<div class="input-group"> ' +
                          '<span class="input-group-addon">' +
                          '  <input id="is_active[]" name="is_active[]" type="checkbox"  class="is_active" value="on" checked>' +
                          '</span>' +
                          '<input id="botanswer[]" name="botanswer[]" type="text" class="form-control botanswer">' +
                        '</div>';
    $("#form_answers").append(str);
}

//load content on the form
function editTopicElement(tid, _id) {
	location.href = "/bs-admin/topic/editelement?_id=" + _id + "&tid=" + tid
}

//when off random button, alert and delete records
function onOffRandom(obj) { 
	var button  = document.getElementById("btn_answer_1");
	var form = document.getElementById("form_answers");
	
	if(obj.checked == false){ 
		var quantityInput = form.getElementsByClassName('form-control');

		// if the number of input tags is > 1 then alert else just hide it 
		if(quantityInput.length > 1){
			swal({
			  title: 'Your data will be close.',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,	
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, sure!'
			}).then((result) => {
				//user click ok
				if(result){
					button.style.visibility = "hidden";
					var str = "<div class='input-group'>" + 
									"<span class='input-group-addon'>" +
		                            "<input id='is_active[]' name='is_active[]' type='checkbox' disabled='true' checked class = 'is_active'>" +
		                          "</span>" +
		                          "<input id='is_answer[]' name='is_answer[]' type='text' class='form-control botanswer' value='"+quantityInput[0].value+"'>" +
		                        "</div>";

		            form.innerHTML = str;
		        }
		        //user click cancel
		    }, (dismiss)=> {
		    	if(dismiss =="cancel"){
		    		obj.checked =  true;
		    		//the value here is true but it cannot display the green button
		    	}
		    });

		}else{
			button.style.visibility = "hidden";
		}
	}else{
		button.style.visibility = "visible";
	}
}

//this function helps us show the records from database
function showValueData(){
	var id;
	var topic_id = $('#topic_id').val();
	
	//call ajax to send the topic. Server processes and return the records which have corresponding topic
	$.ajax({
	    	type: "POST",
	    	url: "/bs-admin/topic/showelementdata",
	    	data: {topic_id: topic_id},
	    	success: function(success){
				let data = success.data;
				let topicName = success.topic_name;
				
	    		var table = document.getElementById('table');
	    		var str = "<tr>" + 
			                  "<th> </th>" + 
			                 " <th>Name</th>" +
			                  "<th>Question </th>" + 
			                  "<th> </th>" +
			                  "<th> </th>" +
			                "</tr>" ;
			    for (var i = 0; i < data.length; i++) {
			    	id = data[i].id+ "";
				    str += "<tr>" + 
			                  "<td>"+(i+1)+"</td>"+
			                  "<td>"+ data[i].user_say +"</td>" + 
			                  "<td>"+ data[i].answer +"</td>" + 
			                  "<td>"  +
			                    "<a href='#' title='Click here to edit' onClick='editTopicElement(\""+topic_id+"\", \""+data[i]._id+"\")'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit</a>" + 
			                  "</td>" +
			                 " <td>" +
			                    "<a  href='#' title='Click here to delete' onClick='confirmDeleteContent(\""+topic_id+"\", \""+data[i]._id+"\")' style='color: #dd4b39;' ><i class='fa fa-times-circle' aria-hidden='true'></i> Delete</a>"+
			                 " </td>"+
			                "</tr>" ;
		        }
		        table.innerHTML = str;
	    	}
	    });
}

//confirm
function confirmDeleteContent(topic_id, tid){
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
			  		deleteContent(topic_id, tid);
			  }
		});
}

//send request to server and delete corresponding record
function deleteContent(topic_id, tid){
	$.ajax({
			type: "POST",
	  		url: "/bs-admin/topic/deleteelement",
	  		data: {topic_id: topic_id, id : tid},
			success: function(data){

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
		var is_active= document.getElementsByClassName('is_active');
		var answer= document.getElementsByClassName('botanswer');
		var callback = document.getElementById('callback');
		var type = document.getElementById('type');
		var user_say = document.getElementById('user_say');

		//clear error msg
		clearErrorMessage();

		//create object content combining the information
		var topic_content = {
					user_say: user_say.value,
					answer: [],
					lang: "vi",
					callback: callback.value,
					type: 1,
					topic_id : $('#topic_id').val(),
					id: $("#id").val()
				};
		
		switch(type.textContent.trim()){
			case 'In Topic':
				topic_content.type = 1;
				break;
			case 'Start Topic':
				topic_content.type = 2;
				break;
			case 'End Topic':
				topic_content.type = 3;
				break;
		}


		let j = 0;

		for(var i = 0; i < answer.length; i++){
			if((is_active[i].checked) && (answer[i].value.length > 0)) {
				topic_content.answer[j] = answer[i].value;
				j++;
			}
		}
		
		console.log(topic_content);

		//cal ajax
		$.ajax( {
			type: "POST",
			url: "/bs-admin/topic/saveelement",
			data: topic_content,
			success: function(data) {

			if((data.error != undefined ) && ((data.error != null) && (data.error.length > 0))){
				showErrorMessage(data.error);
				console.log(data);
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
						timer: 2000
					}).then((result)=>{	
						reset();
					}).catch(timer => {
						reset();
					});
				}
	    	}	   
		});
}

// this function resets form. reset the item in localStorage and redirect to "/"
function reset(){
	var topic_id = $('#topic_id').val();
	location.href = "/bs-admin/topic/showelement?_id=" + topic_id;
}


//function gets topic from server. return all topics in database
function getTopicFromServer(){
	$.ajax({
		type: "POST",
		url: "/bs-admin/topic/gettopic",
		success: function(topic){
			var ul = document.getElementById('topic');
			var str ="";
			for (var i = 0; i < topic.length; i++) {
				str += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" onClick="showTopic(\''+topic[i]+'\')">'+topic[i]+'</a></li>';
			}
			ul.innerHTML = str;
		}
	});
}

//when click to topic, this function bellow displays the topic and render the records having the same topic
function showTopic(topicName){
	var button = document.getElementById('menu1');
	button.innerHTML = topicName;
	showData();
}

function selectType(type){
	event.preventDefault();
	$('#type').text(type);
}

/*
Script page
Date: 09/05/2018
Auth: Nospk Tran
*/
$( document ).ready(function() {
	var type = $('#type').val();
	var select = document.querySelector('#gender');

	select.value = type;
	if($('#role_id').val()==1){
	  $('#job').text('Admin');
	}
	if( $('#phone').val() ==""){
	  $('#phone').val("+84");
	}

  });


function save() {
	//make Object 
	
    var datasend = new Object();
    datasend = {
		_id : $('#_id').val(),
        password : $('#password').val(),
        new_password : $('#new_password').val(),
        re_new_password : $('#re_new_password').val(),
        gender: $('.select2').val(),
        full_name : $('#full_name').val(),
        address : $('#address').val(),
        phone : $('#phone').val(),
        note : $('#note').val(),
    };
    // make dataform
    var data = new FormData();
    data.append('datasend',JSON.stringify(datasend));
    //check image
    if($('#image')[0].files[0] != undefined){
        data.append('image',$('#image')[0].files[0]);}
    $.ajax({
		async: false,
		cache: false,
		// bộ ba cần phải nhớ khi chuyển formdata
		enctype: 'multipart/form-data',
		processData:false,
		contentType: false,
		//************
		url : 'profile/save',
		type: "post",
		data: data,
		success: function(data) {
            if((data.error != undefined ) && ((data.error != null) && (data.error.length > 0))){
				clearErrorMessage();
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
					window.location.href = "/profile"
				});
				
				
            }
            // refresh data
            
        }
		});    

    
}

function reset(){
        $('#profile-form')[0].reset();
            
    }
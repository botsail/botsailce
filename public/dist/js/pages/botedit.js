function reset(){
    $("#topicName").val('');
    $("#topicDes").val('');
    $("#topicLng").val('en');
    $("#imageupload").val('');
}

function save(){

    var formData = new FormData(document.getElementById('topicInfo'));

    $.ajax({
        type: "POST",
        url: "/bot_edit",
        data: formData,
        processData: false,  // Important!
        contentType: false,
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
                window.location.href="/bot_list";
            });
        }
        
        }	   
    });
}
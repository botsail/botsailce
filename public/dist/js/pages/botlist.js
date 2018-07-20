function selectType(type,id){
    if(type == 'Edit'){
        window.location.href = '/bot_edit/' + id;
    }
    if(type == 'Remove'){
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
                        deletebot(id);
                }
          });
    }
    if(type == 'Clone'){
        $.ajax({
            type: 'POST',
            url: '/clonebot',
            data : {id: id},
            success: function(json){
                window.location.href = '/bot_list';
            }
        })
    }
    if(type == 'Export'){
        swal({
            title: 'Do you want to save chat content of client?',
            text: "You won't be able to revert this!",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: 'No, I dont need!'
          }).then(
            (result) => {
                if(result){
                    exportbot(id, 'yes');
                }
            },
            (dismiss) => {
                if(dismiss){
                    exportbot(id, 'no');
                }
            }
        )
    }
}

function exportbot(id, choice){
    $.ajax({
        type: "POST",
        url: "/exportbot",
        data: {id: id, choice: choice},
        success: function(json){
            data = json.data;
            namefile = data.namefile
            window.location.href = '/exportbotdata/' + namefile;
        }
    })
}


function deletebot(id){
    $.ajax({
        type: "POST",
          url: "/deletebot",
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
                  window.location.href = '/bot_list';
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

function loadActionPage() {
	$.ajax({
        type: "GET",
        url: "/json",
        success: function(){
            window.location.href = "/content/show";
        }
    })
}

function develop_bot(id, name){
    $.ajax({
        type: "GET",
        url: "/active_bot",
        data: {id: id},
        success: function(){
            swal({
                      text: "[" + name + "] in develop",
                      showConfirmButton: false,
                      timer: 2000
                  }).then((value) => {
				  loadActionPage();
				}).catch(error => {
				  loadActionPage();
				})
        }
    })
}
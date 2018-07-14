$(document).ready(()=>{
    showdata();
    // press enter  make new user
    $('#new_userattributes').on('keydown', (e)=>{
        if(e.which==13){
            newuseratt();
        }
    });
    // press enter user edit user
    $('#edit_userattributes').on('keydown', (e)=>{
            if(e.which==13){
                edituseratt();
            }
    });
    // press enter  make bot 
    $('#new_botvalue').on('keydown', (e)=>{
            if(e.which==13){
                newbotatt();
            }
    });
    //focus when click new user att
    $('#myModal-new-userattributes').on('shown.bs.modal', function() {
        $("#new_userattributes").focus();
    });
    //focus when click new bot att
    $('#myModal-new-botattributes').on('shown.bs.modal', function() {
        $("#new_botattributes").focus();
    });
    
    
    
    // show element data form server
    function showdata(){
        $.ajax({
            type: "POST",
            url: "/attribute_show",
            success: function(data){//data include user and bot
                if(data.status=="1"){
                    let view = data.data;
                    let html_user='', html_bot='';
                    const viewuser= document.getElementById('user-table');
                    const viewbot= document.getElementById('bot-table');
                    //render user
                    for(var i=0;i<view.user.length;i++){
                        html_user += '<button type="button" class="btn btn-default addRule useratt" data-name="'+ view.user[i].name +'" data-toggle="modal" data-target="#myModal-edit-userattributes">'
                                    + view.user[i].name+'</button>'	
                    }
                    //render bot
                    for(var i=0;i<view.bot.length;i++){
                        html_bot += '<button type="button" class="btn btn-default addRule botatt" data-value="'+ view.bot[i].value +'" data-name="'+ view.bot[i].name +'" data-toggle="modal" data-target="#myModal-edit-botattributes">'
                                    + view.bot[i].name+'</button>'	
                    }
                    viewuser.innerHTML = html_user;// view  
                    viewbot.innerHTML = html_bot;//view
                }else{
                console.log(data.message);
                    swal({
                      title: 'ERROR',
                      text: data.error,
                      type: 'error',
                      showConfirmButton: true
                    })
                }
            }
        })
    }
    
});
$(document).on("click", ".useratt", function () {
        let name = $(this).data('name');
        $('.modal-body #old_attributes').val(name);
});
$(document).on("click", ".botatt", function () {
        let name = $(this).data('name');
        $('.modal-body #old_botattributes').val(name);
});
$(document).on("click", ".botatt", function () {
        let value = $(this).data('value');
        $('.modal-body #edit_botvalue').val(value);
});
//make new bot attribute
function newbotatt(){
        $.ajax({
            type: "POST",
            url: "/newbotatt",
            data: {name: $('#myModal-new-botattributes #new_botattributes').val(), value: $('#myModal-new-botattributes #new_botvalue').val()},
            success: function(data){
                if(data.status=="1"){
                    swal({
                        title: 'Successfully',
                        text: data.message,
                        type: "success",
                        showConfirmButton: true,	
                        timer: 2000
                    }).then((result)=>{	
                        location.reload();
                    }).catch(timer => {
                        location.reload();
                    });
                }else{
                    swal({
                        title: 'error',
                        type: "error",
                        text: data.error,
                        showConfirmButton: false,	
                        timer: 2000
                    });
                }
            }
        })
    }

// make new user attributes
        
function newuseratt(){
        $.ajax({
            type: "POST",
            url: "/newuseratt",
            data: {name: $('#myModal-new-userattributes #new_userattributes').val()},
            success: function(data){
                if(data.status=="1"){
                    swal({
                        title: 'Successfully',
                        text: data.message,
                        type: "success",
                        showConfirmButton: true,	
                        timer: 2000
                    }).then((result)=>{	
                        location.reload();
                    }).catch(timer => {
                        location.reload();
                    });
                }else{
                    swal({
                        title: 'error',
                        type: "error",
                        text: data.error,
                        showConfirmButton: false,	
                        timer: 2000
                    });
                }
            }
        })
    }
    //edit user name
    function edituseratt(){
            $.ajax({
                type: "POST",
                url: "/edituseratt",
                data: {old_name: $('#myModal-edit-userattributes #old_attributes').val(), new_name:$('#myModal-edit-userattributes #edit_userattributes').val()},
                success: function(data){
                    if(data.status=="1"){
                        swal({
                            title: 'Successfully',
                            text: data.message,
                            type: "success",
                            showConfirmButton: true,	
                            timer: 2000
                        }).then((result)=>{	
                            location.reload();
                        }).catch(timer => {
                            location.reload();
                        });
                    }else{
                        swal({
                            title: 'error',
                            type: "error",
                            text: data.error,
                            showConfirmButton: false,	
                            timer: 2000
                        });
                        $('#myModal-edit-userattributes #new_attributes').val("");
                    }
                }
            })
        }
        // confirm delete 
        function confirmDeleteUserAtt(){
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
                            deluseratt();
                        }
                });
        }
        //if ok delete
        function deluseratt(){
            $.ajax({
                type: "POST",
                url: "/deluseratt",
                data: {name: $('#myModal-edit-userattributes #old_attributes').val()},
                success: function(data){
                    if(data.status=="1"){
                        swal({
                            title: 'Successfully',
                            text: data.message,
                            type: "success",
                            showConfirmButton: true,	
                            timer: 2000
                        }).then((result)=>{	
                            location.reload();
                        }).catch(timer => {
                            location.reload();
                        });
                    }else{
                        swal({
                            title: 'error',
                            type: "error",
                            text: data.error,
                            showConfirmButton: false,	
                            timer: 2000
                        });
                    }
                }
            })
        }
        //edit bot name
    function editbotatt(){
            $.ajax({
                type: "POST",
                url: "/editbotatt",
                data: {old_name: $('#myModal-edit-botattributes #old_botattributes').val(), new_name:$('#myModal-edit-botattributes #edit_botattributes').val(), value:$('#myModal-edit-botattributes #edit_botvalue').val() },
                success: function(data){
                    if(data.status=="1"){
                        swal({
                            title: 'Successfully',
                            text: data.message,
                            type: "success",
                            showConfirmButton: true,	
                            timer: 2000
                        }).then((result)=>{	
                            location.reload();
                        }).catch(timer => {
                            location.reload();
                        });
                    }else{
                        swal({
                            title: 'error',
                            type: "error",
                            text: data.error,
                            showConfirmButton: false,	
                            timer: 2000
                        });
                        $('#myModal-edit-botattributes #edit_botattributes').val("");
                    }
                }
            })
        }
    // confirm delete bot
    function confirmDeleteBotAtt(){
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
                            delbotatt();
                        }
                });
        }
        //if ok delete
        function delbotatt(){
            $.ajax({
                type: "POST",
                url: "/delbotatt",
                data: {name: $('#myModal-edit-botattributes #old_botattributes').val()},
                success: function(data){
                    if(data.status=="1"){
                        swal({
                            title: 'Successfully',
                            text: data.message,
                            type: "success",
                            showConfirmButton: true,	
                            timer: 2000
                        }).then((result)=>{	
                            location.reload();
                        }).catch(timer => {
                            location.reload();
                        });
                    }else{
                        swal({
                            title: 'error',
                            type: "error",
                            text: data.error,
                            showConfirmButton: false,	
                            timer: 2000
                        });
                    }
                }
            })
        }	
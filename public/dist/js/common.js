$( document ).ready(checkUpdate())


function clearErrorMessage() {
  for(let i = 0; i < $('.error-msg').length; i++) {
    id = $('.error-msg')[i].id;
    $("#" +id + "").text('');
  }
}

function showErrorMessage(error) {
  clearErrorMessage();
  
  for(let i = 0; i < error.length; i++) {
    id = "error-" + error[i].param;
    $("#" +id + "").text(error[i].msg);
  }
}



function checkUpdate(){
  let checkcud = false;
  var cookie = document.cookie.split(';');

  for(var i=0; i<cookie.length; i++){
    cookie[i] = cookie[i].trim();

    if(cookie[i].indexOf('cbu') != -1){
      checkcud = true;
    }

    if(cookie[i].indexOf('cbv') != -1){
      var cbv = cookie[i].slice(cookie[i].length-3,cookie[i].length);
    }

  }

  if(checkcud ==  true){

    url = 'https://api.botsail.org/check-update?v=' + cbv;

    $.ajax({
      type: "GET",
      url: url,
      success: function(json){

        if(json.update == "OK"){
          var newversion = json.new_version;
          var htmlupdate = 'New version ' + newversion + ' is available ' + '&nbsp; <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal" data-backdrop="false" onclick="updatenewversion(' + newversion + ')">Update</button>' 
          
          $('#header-message').html(htmlupdate);
        }

      }
    })
  }
}

function updatenewversion(newversion){
  swal({
      title: 'Updating...!', 
      text: 'Please wait',
      showConfirmButton: false, 
      showCancelButton: false, // There won't be any cancel button
      allowOutsideClick: false
  });
  var urlupdate = window.location.protocol + "//" + window.location.host + '/update-to-version?v=' + newversion;
  $.ajax({
    type: 'POST',
    url: urlupdate,
    success: function(res){
      console.log(document.cookie);
      if(res == 'error'){
        swal({
          title: 'error',
          type: 'error',
          text: 'Error : Update unsuccessful',
          showConfirmButton: false, 
          showCancelButton: false, // There won't be any cancel button
          allowOutsideClick: false

        });
      }else{
        swal({
          title: 'Successfully',
          text: "Update Successfully!",
          showConfirmButton: true,  
          showCancelButton: false, // There won't be any cancel button
          allowOutsideClick: false,
        }).then((result)=>{
          location.reload();
        })
      }
    }
  })
}
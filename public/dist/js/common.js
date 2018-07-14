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
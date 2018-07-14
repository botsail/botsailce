var current_page = 1;
var records_per_page = 12;

var objJson = [];

function showUploadModal() {
	$.ajax({
			type: "GET",
	  		url: "/gallery",
			async:false,
			success: function(json){
				objJson = json;
			}
  	});
	$('#modalUploadImg').modal('show'); 
	$('.btn-show-upload-img').click(showUploadContent);
	$('.btn-show-gallery').click(callShowGallery);
	showGallery(1);
}

function callShowGallery() {
	$.ajax({
			type: "GET",
	  		url: "/gallery",
			async:false,
			success: function(json){
				objJson = json;
			}
  	});
	showGallery(1);
}

function uploadImage() {
  event.preventDefault();

  let formData = new FormData();
  let file = $('#inputUploadFileImg')[0].files[0];
  formData.append('imgUploadToServer', file);

  $.ajax({
      url: '/uploadImg',
      method: 'post',
      data: formData,
      processData: false,
      contentType: false
    })
    .then(res => {
      if (res.success) alert('success');
      else alert(res.msg);
      this.reset();
    })
}

function renderUploadForm() {
  return `
    <div class="row">
      <div class="col-12 text-center">
        <form action="/uploadImg" encType="multipart/form-data" method="POST" id="formUploadImage">
          <label class="btn btn-default" style="width: 400px; padding-bottom: 20px">
            <img src="images/upload-512.png" alt="" style="width: 50px">
            <br>
            <span class="btn btn-success">Choose file to upload</span>
            <br>
            <input type="file" class="form-control" style="margin-top: 20px" name="imgUploadToServer" id="inputUploadFileImg">
            <br>
            <span class="text-center">or drag and drop them here</span>
          </label>
          <br><br>
          <button class="btn btn-success" type="submit">Upload to server</button>
        </form>
      </div>
    </div>
    `
}

function chooseImg() {
  $ele = $(event.target);
  $ele.parent('.well').toggleClass('chosen-img');
}

function saveImgHiddenField() {
  // save img to hidden field
  let selectedImg = '';
  $('.chosen-img').each((index, ele) => {
    selectedImg += $(ele).children('img').attr('src') + ', ';
  })
  selectedImg = selectedImg.substring(0, selectedImg.length - 2);
  $('.popup-selected-image').val(selectedImg);
  //hide popup
  $('#modalUploadImg').modal('hide');
  try { affterSelectImage() } catch(ex) {}
}

function showUploadContent() {
  let html = renderUploadForm();
  $('#modalUploadImg').find('.modal-body').html(html);
  $('#formUploadImage').submit(uploadImage);
}

function showGallery(page) {
	let html = renderGalleryContent(page);
	$('#modalUploadImg').find('.modal-body').html(html);  
	$('.img-show').click(chooseImg);
	$('.btn-select-img').click(saveImgHiddenField);
	  
	//Paging
	var page_span = document.getElementById("page");
	let total_page = parseInt(objJson.gallery.length / records_per_page + 0.75);
	page_span.innerHTML = page + " / " + total_page;

	if (page == 1) {
		btn_prev.style.visibility = "hidden";
	} else {
		btn_prev.style.visibility = "visible";
	}

	if (page == numPages()) {
		btn_next.style.visibility = "hidden";
	} else {
		btn_next.style.visibility = "visible";
	}
  
}

function renderGalleryContent(page) {
  let html = changePage(page);
  return `
    <div class="row">
      <div class="col-sm-10"></div>
      <div class="col-sm-2">
        <button class="btn btn-primary btn-block btn-select-img">Select</button>
      </div>
    </div>
    <div id="gallery_list" class="row" style="margin-top: 15px;">` + 
      html + 
    `</div>
    <div class="row">
      <div class="col-8 mx-auto">
        
		
		<ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="javascript:prevPage()" aria-label="Previous" id="btn_prev">
              <span aria-hidden="true">&laquo; Previous </span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" href="javascript:nextPage()" aria-label="Next"  id="btn_next">
              <span aria-hidden="true"> Next &raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
		page: <span id="page"></span>
      </div>
    </div>
    `
}


function prevPage()
{
    if (current_page > 1) {
        current_page--;
        showGallery(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        showGallery(current_page);
    }
}
    
function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    //var listing_table = document.getElementById("gallery_list");
    
	let listing_table = "";
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();
	let image_path = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
	    if(i >= objJson.gallery.length) break;
		image_path = "/uploads/bots/" + objJson.bot_ym + "/" + objJson.bot_id + "/"+ objJson.gallery[i];
        listing_table +=  `
	<div class="col-sm-3">
		<center>
        <div class="well">
          <img src="` + image_path + `" alt="" class="img-responsive img-show">
        </div>
		</center>
      </div>
		`;
		
		//objJson[i] + "<br>";
    }
	
	
	
	return listing_table;
}


function numPages()
{
    return Math.ceil(objJson.length / records_per_page);
}

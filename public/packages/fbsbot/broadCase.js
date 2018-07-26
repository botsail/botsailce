$(() => {
  //when user click btn broadcase
  $('#btnBroadcase').click(() => location.href = '/fbsbot/chatbotMsg');

  getBroadcaseData();
})

function getBroadcaseData() {
  $.ajax({
      url: '/fbsbot/getBroadcaseData',
      method: 'post',
    })
    .then(res => {
      if(res.success && res.data){
        renderBroadcaseTable(res.data);
      }
    });
}

function renderBroadcaseTable(data){
  let $table = $('#tblBroadcase');
  $table.html('');

  let $thead = $('<thead></thead');
  let $tbody = $('<tbody></tbody');

  $table.append($thead).append($tbody);
  
  $thead.html(`
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Content</th>
      <th>Members</th>
      <th>Action</th>
    </tr>
  `)
  
  data.forEach((broadcase, index) => {
    let tr = `
      <tr>
        <td>${index + 1}</td>
        <td>${broadcase.title}</td>
        <td>${broadcase.content}</td>
        <td>${broadcase.member.length}</td>
        <td>
          <button class="btn btn-info btn-view-detail">View</button>
        </td>
      </tr>
    `;
    $tbody.append(tr);
    $tbody.find('.btn-view-detail').last().click(() => {
      showDetails(broadcase);
    })
  })
}

function showDetails(broadcase){
  console.log(broadcase);
  if(broadcase){
    renderModal(broadcase);
  }
}

function renderModal(broadcase){
  let $modal = $('#broadCaseDetail');
  getFullnameUser(broadcase.member)
  .then(res => {
    if(res.success){
      $modal.find('.modal-body').html(`
        <form>
          <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-control" value="${broadcase.title}" disabled>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" rows="3" disabled>${broadcase.description}</textarea>
          </div>
          <div class="form-group">
            <label>Content</label>
            <textarea class="form-control" rows="5" disabled>${broadcase.content}</textarea>
          </div>
        </form>
        <label for="">Danh sach</label>
        <div id="linksFB"></div>
      `);

        res.data.forEach((name, index) => {
          $modal.find('.modal-body').find('#linksFB').append(`
            <a href="https://facebook.com/profile.php?id=${broadcase.member[index]}">${name}</a>
          `)
        })
    }
    $('#broadCaseDetail').modal('show');
  })  
}

function getFullnameUser(uidArr){
  return $.ajax({
    url:'/fbsbot/getFullnameUser',
    method:'post',
    data:{uidArr}
  })
}

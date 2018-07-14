$(() => {
  let tag = $('#hiddenTagName').val();
  $('#txtTagName').val(tag);
  $('#btnSaveTagName').click(saveTagName);
  renderModalFrame();
  getAllUsersByTagname(tag.trim());
})

function saveTagName(e) {
  let newTagName = $('#txtTagName').val().trim();
  let oldTagName = $('#hiddenTagName').val().trim();

  if (newTagName && oldTagName) {
    $.ajax({
        url: '/fbsbot/updateTagName',
        method: 'post',
        data: {
          oldTagName,
          newTagName
        }
      })
      .then(res => {
        console.log(res);
        if (res.success) {
          swal({
            title: "Update successfully!",
            text: `You changed tag name into "${newTagName}"!`,
            icon: "success",
            button: "Close!",
            timer:3000
          })
          .then(value => {
            location.href = `/edit_tag/${newTagName}`;
          })
        }
      })
      .catch(err => console.log(err));
  } else {
    swal({
      title: "Invalid Info!",
      text: `You have to enter tag name!`,
      icon: "error",
      button: "Close!",
      timer:3000
    })
  }
}

function getAllUsersByTagname(tagName) {
  $.ajax({
      url: '/fbsbot/getAllUsersByTagname',
      method: 'post',
      data: {
        tagName
      }
    })
    .then(res => {
      if (res.success && res.data) {
        renderTableTagList(res.data);
      }
    })
    .catch(err => console.log(err));
}

function renderTableTagList(data) {

  $table = $('#lastMsgWithTag');
  $table.html('');

  $thead = $('<thead></thead>');
  $tbody = $('<tbody></tbody>');

  $thead.html(`
        <tr>
            <th>#</th>
            <th>Fullname</th>
            <th>Gender</th>
            <th>Last-message</th>
            <th>Actions</th>
        </tr>
    `)

  data.forEach((user, index) => {
    let {fullname, gender, data, _id} = user;
    $tbody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${fullname}</td>
                <td>${gender}</td>
                <td class="showModalMsg">${data[data.length - 1].message}</td>
                <td>
                    <button class="btn btn-danger" onClick="deleteUserTag('${_id}')">Delete</button>
                </td>
            </tr>
        `)
        $tbody.find('.showModalMsg').last().click(function(){
          renderModelUserMsg(data, fullname);
        })
  })

  $table.append($thead).append($tbody);
}

function deleteUserTag(idUser) {
  showConfirmRemove()
  .then((willDelete) => {
    if (willDelete) {
      let tagName = $('#hiddenTagName').val();
    //format data send to server
    if (idUser) idUser = idUser.trim();
    if (tagName) tagName = tagName.trim();

      $.ajax({
        url: '/fbsbot/removeUserTag',
        method: 'post',
        data: {
          tagName,
          idUser
        }
      })
      .then(res => {
        if (res.success) {
          swal("Deleted successfully!", {
            icon: "success",
          });
          getAllUsersByTagname(tagName);
        }
      })
      .catch(err => console.log(err));
    } else {
      swal("Not deleted!");
    }
  });
}

function showConfirmRemove(){
  return swal({
    title: "Are you sure?",
    text: "Once deleted, you will not recover!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
}
  



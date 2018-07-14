
let tagsList = [];

$(() => {

    $('#searchTag').keyup(searchTag);
    $('#searchTag').change(searchTag);
    
    getTagsList();
    
})

function getTagsList(){
    $.ajax({
        url:'/fbsbot/getTagsList',
        method:'get'
    })
    .then(res => {
        if(res.success && res.data){
            renderTableTagList(res.data);
            tagsList = res.data.slice(0);
        }
    })
    .catch(err => console.log(err));
}

function searchTag(e){
    let search = e.target.value.toLowerCase();
    let list = tagsList.filter(tag => tag.toLowerCase().indexOf(search) > -1);
    renderTableTagList(list);
}

function renderTableTagList(data){
    $table = $('#tagsListTable');
    $table.html('');
    $thead = $('<thead></thead>');
    $tbody = $('<tbody></tbody>');

    $thead.html(`
        <tr>
            <th>#</th>
            <th>Tag name</th>
            <th></th>
        </tr>
    `)

    data.forEach((tag, index) => {
        $tbody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${tag}</td>
                <td>
                    <button class="btn btn-danger" onClick="deletetag('${tag}')">Delete</button>
                    <button class="btn btn-success" onClick="updatetag('${tag}')">Update</button>
                </td>
            </tr>
        `)
    })

    $table.append($thead).append($tbody);
}

function deletetag(tagName){
    showConfirmRemove()
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url:'/fbsbot/removeTag',
                method:'post',
                data: { tagName }
            })
            .then(res => {
                swal("Deleted!", { icon: "success" })
                .then(() => {
                    getTagsList();
                })
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

function updatetag(tagName){
  location.href = `/edit_tag/${tagName}`;
}


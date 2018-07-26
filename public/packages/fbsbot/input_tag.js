//save all user
let myUserListInputTagPage = [];
// save all idUser needed to add new tag
let myIDUserArrInputTagPage = [];

$(() => {
    $('#btnTagEditPage').click(showModal);
    $('#txtSearchTagInputPage').keyup(filterData);
    $('#txtSearchTagInputPage').change(filterData);
    $('#btnSaveTagInputPage').click(addTagToUsers);
    //renderModalFrame();
    getAllUser()
})

function filterData(){
    let search = $('#txtSearchTagInputPage').val();
    if(search.trim() == '') renderTableLastMsgAndTag(myUserListInputTagPage);
    else{
        search = search.toLowerCase();
        let arr = myUserListInputTagPage.filter(user => user.fullname.toLowerCase().indexOf(search) > -1);
        renderTableLastMsgAndTag(arr);
    }
}

function getAllUser(){
    $.ajax({
        url:'/fbsbot/getAllUser',
        method:'get'
    })
    .then(res => {
        console.log(res);
        if(res.success && res.data){
            myUserListInputTagPage = res.data;
            renderTableLastMsgAndTag(res.data);
        }
    })
    .catch(err => console.log(err));
}

function renderTableLastMsgAndTag(data){
    $table = $('#tblTagAndLastMsg');
    $table.html('');
    let $thead = $('<thead></thead>');
    let $tbody = $('<tbody></tbody>');

    $thead.html(`
        <tr>
            <td>#</td>
            <td>Fullname</td>
            <td>Gender</td>
            <td>Last message</td>
            <td>Tag</td>
        </tr>
    `)

    data.forEach((user, index) => {
        let tags = ''
        user.tags.forEach(t => tags += `${t}, `);
        tags = tags.substring(0, tags.length - 2);
        
        $tbody.append(`
            <tr>
                <td><input type="checkbox" onChange="checkUser('${user._id}')"></td>
                <td>${user.fullname}</td>
                <td>${user.gender}</td>
                <td class="showModalMsg">${user.data[user.data.length - 1].message}</td>
                <td>${tags}</td>
            </tr>
        `)
        $tbody.find('.showModalMsg').last().click(function(){
            renderModelUserMsg(user.data, user.fullname);
        });
    })
    $table.append($thead).append($tbody);
}

function addTagToUsers(){
    let tagName = $('#txtNewTagName').val().trim();
    // close modal
    $('#tagModalInputPage').modal('hide');
    //reset value input
    $('#txtNewTagName').val('');
    //call ajax
    $.ajax({
        url:'/fbsbot/addTagToUsers',
        method:'post',
        data: { tagName, idUsers : myIDUserArrInputTagPage }
    })
    .then(res => {
        if(res.success){
            myUserListInputTagPage = res.data;
            myIDUserArrInputTagPage = [];
            swal({
                title: "Successfully",
                text: `You have added tag "${tagName}"!`,
                icon: "success",
                buttons: true,
                timer:3000
            })
            getAllUser();
        }
    })
    .catch(err => console.log(err));
}

function showModal(){
    $('#tagModalInputPage').modal('show');
}

function checkUser(idUser){
    idUser = idUser.trim();
    if(event.target.checked){
        myIDUserArrInputTagPage.push(idUser);
    }else{
        let index = myIDUserArrEditTagPage.findIndex(id => id == idUser);
        myIDUserArrInputTagPage.splice(index, 1);
    }
}
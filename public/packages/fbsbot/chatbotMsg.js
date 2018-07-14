//contain all userid need to sending message
const checkedLastMsgArr = [];

$(() => {
    //set event for back btn
    $('.btn-back').on('click', () => location.href = '/broadcase');
    //event for send btn
    $('#btnSend').on('click', showBroadcaseModal);

    $('#btnSendMsg').on('click', saveBroadcaseAndSendMsg);
    // get all last msg when load page
    getAllLastMsg();
    
})


function getAllLastMsg(){
    $.ajax({
        url: '/fbsbot/getAllLastMsg',
        type: 'POST'
    })
    .then(res => {
        if (res.success && res.data)
           renderTableLastMsg(res.data);
    });
    //.catch(err => console.log(err));
}

function renderTableLastMsg(data) {

    let $table = $('.last-msg-table');
    $table.html('');

    let $thead = $('<thead></thead>');
    let $tbody = $('<tbody></tbody>');

    $table.append($thead).append($tbody);

    $thead.html(
        `
        <tr>
            <th>#</th>
            <th>Fullname</th>
            <th>Gender</th>
            <th>Last message</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    `
    )

    let html = '';
    data.forEach((lastMsg, index) => {
        html +=
            `
                <tr>
                    <td>
                        <input type="checkbox" class="form-check-input" onClick="check('${lastMsg.uid}', '${lastMsg.fullname}')">
                    </td>
                    <td>${lastMsg.fullname}</td>
                    <td>${lastMsg.gender}</td>
                    <td>${lastMsg.data[0].message}</td>
                    <td>${getDateFormat(lastMsg.data[0].time)}</td>
                    <td>
                        <button class="btn btn-primary" onClick = "getAllMsgUser('${lastMsg._id}')">Open</button>
                    </td>
                </tr>
            `
    });

    $tbody.html(html);
}

function check(uid, fullname){
    if(event.target.checked == true){
        checkedLastMsgArr.push({uid, fullname});
    }else{
        let index = checkedLastMsgArr.findIndex(msg => msg.uid == uid);
        checkedLastMsgArr.splice(index, 1);
    }
    console.log(checkedLastMsgArr);
}

function getDateFormat(time) {
    let d = new Date(time);
    return d.toLocaleDateString();
}

function getAllMsgUser(_id) {
    $.ajax({
        url:'/fbsbot/getDataOneUser',
        type:'POST',
        data: { _id }
    })
    .then(res => {
        console.log(res.data.data);
       renderModelUserMsg(res.data.data, res.data.fullname);
    });
    //.catch(err => console.log(err));
}

function getTimePassed(time){
    let now = Date.now();
    let passed = parseInt((now - time) / 1000);

    if(passed < 60){
        return `${passed} ${passed == 1 ? 'second' : 'seconds'} ago`;
    }
    if(passed < 3600){
        let t = parseInt(passed / 60);
        return `${t} ${t == 1 ? 'minute' : 'minutes'} ago`;
    } 
    if(passed < 3600 * 24){
        let t = parseInt(passed / 3600);
        return `${t} ${t == 1 ? 'hour' : 'hours'} ago`;
    }
    if(passed < 3600 * 24 * 7){
        let t = parseInt(passed / (3600 * 24));
        return `${t} ${t == 1 ? 'day' : 'days'} ago`;
    }

    if(passed < 3600 * 24 * 30){
        let t = parseInt(passed / (3600 * 24 * 7));
        return `${t} ${t == 1 ? 'week' : 'weeks'} ago`;
    }
    if(passed < 3600 * 24 * 365){
        let t = parseInt(passed / (3600 * 24 * 30));
        return `${t} ${t == 1 ? 'month' : 'months'} ago`;
    }
    else{
        let t = parseInt(passed / (3600 * 24 * 365));
        return `${t} ${t == 1 ? 'year' : 'years'} ago`;
    } 
}

function renderModelUserMsg(data, name) {

    let html = '';

    data.forEach((msg, index) => {
        html += `
            <li class="right clearfix">
                <span class="chat-img pull-right">
                    <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
                </span>
                <div class="chat-body clearfix">
                    <div class="header">
                        <small class=" text-muted">
                            <span class="glyphicon glyphicon-time"></span>${getTimePassed(msg.time)}</small>
                        <strong class="pull-right primary-font">${name}</strong>
                    </div>
                    <p>${msg.message} </p>
                </div>
            </li>
            <li class="left clearfix">
                <span class="chat-img pull-left">
                    <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                </span>
                <div class="chat-body clearfix">
                    <div class="header">
                        <strong class="primary-font">Chatbot</strong>
                        <small class="pull-right text-muted">
                            <span class="glyphicon glyphicon-time"></span>${getTimePassed(msg.time)}</small>
                    </div>
                    <p>${msg.message} </p>
                </div>
            </li>
        `
    })

    $('#modelUserMsg').find('.chat').html(html);
    $('#modelUserMsg').modal('show');
   
}

function closeModalMsg(){
    $('#modelUserMsg').modal('hide');
}

function showBroadcaseModal(){
    //reset value
    $('#broadcaseTitle').val('');
    $('#broadcaseDesc').val('');
    $('#broadcaseContent').val('');
    
    let str = '';
    checkedLastMsgArr.forEach(info => {
        str += info.fullname + ', ';
    })
    $('#listUsers').html(str.substring(0, str.length - 2));
    
    //show modal
    $('#broadcaseDetail').modal('show');
}

function saveBroadcaseAndSendMsg(){
   
    let title = $('#broadcaseTitle').val().trim();
    let desc =  $('#broadcaseDesc').val().trim();
    let content = $('#broadcaseContent').val().trim();

    if(title == '' || desc == '' || content == '') return alert('You have to input all fields');

    if(checkedLastMsgArr.length == 0) return alert('You have not send any user');

    let member = checkedLastMsgArr.map(user => user.uid);
    let broadCase = {
        title, description: desc, content, member
    }

    console.log(broadCase);
    
    $.ajax({
        url:'/fbsbot/addBroadcase',
        method: 'post',
        data: {broadCase}
    })
    .then(res => {
        if(!res.success) return alert('Error');
       
        $('#broadcaseDetail').modal('hide');
        $('#broadcaseDetail').on('hidden.bs.modal', () => location.href = "/broadcase");

    });
    //.catch(err => console.log(err));
    
}



// var broadcaseSchama = mongoose.Schema({	
//   name:{type:String, default:'facebook-broadcase'},
//   data:[{
//       _id: mongoose.Schema.Types.ObjectId,
//       title:String,
//       description:String,
//       content:String,
//       member:[String],
//   }],
//   system : {type: String, default: 'core'},
//   content:{type:String, default: 'facebook-broadcase'}
// });

// data:[{
//     _id: mongoose.Schema.Types.ObjectId,
//     type: {type:String, default: 'messager'},
//     uid:String,
//     fullname:String,
//     gender:String,
//     data:[ //just 2 elements
//         {
//             time:Number,
//             who:String,
//             message:String
//         }
//     ]
// }],
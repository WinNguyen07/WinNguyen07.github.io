import Peer from 'peerjs';
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const io = require('socket.io-client');

const socket = io('https://webrtc072019.herokuapp.com');

$('#div-chat').hide();

function getPeer() {
    const id = uid(5);    
    return id;    
}

//This example shows you how simple it is to get your ICE credentials
var https = require("https");
var options = {
    host: "global.xirsys.net",
    path: "/_turn/default",
    method: "PUT",
    headers: {
       "Authorization": "Basic " + Buffer.from("winhynguyen:bcf7661e-9ae6-11e9-b18c-0242ac110007").toString("base64"),
    }
};

var httpreq = https.request(options, function(httpres) {
    var str = "";
    httpres.on("data", function(data){ str += data; });
    httpres.on("error", function(e){ console.log("error: ",e); });
    httpres.on("end", function(){
    //console.log("response: ", str);
    });
});

httpreq.end();

const peerID = getPeer();
const peer = new Peer(peerID);

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();        
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

peer.on('call', (call) => {
        openStream(stream => {
            playVideo(stream, 'localStream');
            call.answer(stream);    
            call.on('stream', remoteStream => playVideo(remoteStream, 'remoteStream'));
        });
});

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui lòng chọn username khác!'));
    
$('#ulUser').on('click', 'li', function (){
    const peerID = $(this).attr('id');
    openStream(stream => {
        playVideo(stream, 'localStream');
        const call = peer.call(peerID, stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'remoteStream'));
    });
});

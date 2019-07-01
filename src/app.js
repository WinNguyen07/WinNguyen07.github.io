/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import Peer from 'peerjs';
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');


function getPeer() {
    const id = uid(5);
    $('#peer-id').append(id);
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
    console.log("response: ", str);
    });
});

httpreq.end();


const peer = new Peer(getPeer());

$('#btnCall').click(() => {
    const frID = $('#txtFriendID').val();
    openStream(stream => {
        playVideo(stream, 'myStream');
        const call = peer.call(frID, stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'frStream'));
    });
});

peer.on('call', (call) => {
    openStream(stream => {
        playVideo(stream, 'myStream');
        call.answer(stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'frStream'));
    });
});









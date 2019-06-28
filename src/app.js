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
    const id = uid(10);
    $('#peer-id').append(id);
    return id;    
}

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









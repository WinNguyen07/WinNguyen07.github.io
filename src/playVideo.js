/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function playVideo(stream, idVideo){
    const video = document.getElementById(idVideo);
    video.srcObject = stream;
    video.onloadedmetadata = function(){
        video.play();
    };
}
module.exports = playVideo;
